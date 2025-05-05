
import { access, readdir } from 'fs/promises';
import {createInterface} from 'readline';
import os from 'os';
import path from 'path';

let currentDir = os.homedir();

const parseUsername = () => {
    if(process.argv[2] === undefined){
        console.log('Please enter username');
        process.exit()
    }
    return process.argv[2].split('=').slice(1).join('');;
}
const userName = parseUsername();

const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
})

rl.write(`Welcome to the File Manager, ${userName}!` + '\n');


rl.on('SIGINT', () => {
    console.log('\n'+`Thank you for using File Manager, ${userName}, goodbye!`)
    rl.close();
})


const moveUp = () => {
    const parentDir = path.dirname(currentDir);
    if (parentDir !== currentDir) {
      currentDir = parentDir;
    } else {
      console.log('You are already in root folder');
    }
}

const moveDown = async (sourcePath) => {
    const newPath = path.join(currentDir, sourcePath)
    console.log(newPath);
    try {
        await access(path.normalize(newPath));
        currentDir = path.normalize(newPath);
      } catch {
        rl.write('Invalid path try again !!' + '\n');
      }

}

const handleList = async () => {
    const directory = await readdir(currentDir, {withFileTypes: true});
    console.table(directory.map(d => ({ Name: d.name, Type: d.isDirectory() ? 'directory' : 'file' }))
    .sort((a, b) => a.Type.localeCompare(b.Type) || a.Name.localeCompare(b.Name)));
}

function main(question) {

    rl.write(`You are currently in ${currentDir}`  + '\n')

    rl.question(question, async (answer) => {
        const [command, arg] = answer.split(' ');

        switch (command){
            case '.exit':
                console.log(`Thank you for using File Manager, ${userName}, goodbye!`)
                process.exit(0)
            case 'up':
                moveUp(currentDir);
                break;
            case 'cd':
                await moveDown(arg?? '');
                break;
            case 'ls':
                await handleList()
                break;
            default:
                rl.write('Invalid input' + '\n')
        }
        main(question)
    })
}

main("Enter command: ")

