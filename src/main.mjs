
import { access, readdir } from 'fs/promises';
import {createInterface} from 'readline';
import os from 'os';
import path from 'path';

let currentDir = os.homedir();

const parseUsername = () => {
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

        if(command === ".exit") {
            console.log(`Thank you for using File Manager, ${userName}, goodbye!`)
            process.exit(0)
        }
        if (command === "up"){
            moveUp(currentDir);
        }
        if(command === 'cd'){
            await moveDown(arg);
        }
        if(answer === 'ls'){
           await handleList()
        }
        main(question)
    })
}

main("Enter command: ")

