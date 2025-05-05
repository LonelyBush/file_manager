
import { access, readdir, stat, } from 'fs/promises';
import {createInterface} from 'readline';
import os from 'os';
import path from 'path';
import { createReadStream } from 'fs';

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
process.stdout.write(`\nYou are currently in ${currentDir}\n`);

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
        const dirent = await stat(path.normalize(newPath))

        if(dirent.isDirectory()){
            currentDir = path.normalize(newPath);
        } else {
            throw new Error('You`ve tried to navigate on file !')
        }
      } catch(err) {
        rl.write(`\n${err}\n`);
      }

}

const handleList = async () => {
    const directory = await readdir(currentDir, {withFileTypes: true});
    console.table(directory.map(d => ({ Name: d.name, Type: d.isDirectory() ? 'directory' : 'file' }))
    .sort((a, b) => a.Type.localeCompare(b.Type) || a.Name.localeCompare(b.Name)));
}

const handleReadFile = async (sourcePath) => {
    const newPath = path.join(currentDir, sourcePath)
    try {
        await access(newPath);
    } catch {
        throw new Error(`ENOENT: no such file or directory, open '${newPath}'`);
    }

    return new Promise((resolve, reject) => {
        const read = createReadStream(newPath, { encoding: 'utf-8' });

        read.on('data', (chunk) => {
            process.stdout.write(chunk);
        });

        read.on('end', () => {
            process.stdout.write('\n');
            resolve();
        });

        read.on('error', (error) => {
            reject(error);
        });
    });
}

function main(question) {

    rl.question(question, async (answer) => {
        const [command, arg] = answer.split(' ');

        switch (command){
            case '.exit':
                console.log(`Thank you for using File Manager, ${userName}, goodbye!`)
                process.exit(0)
            case 'up':
                moveUp(currentDir);
                process.stdout.write(`\nYou are currently in ${currentDir}\n`);
                break;
            case 'cd':
                await moveDown(arg?? '');
                process.stdout.write(`\nYou are currently in ${currentDir}\n`);
                break;
            case 'ls':
                await handleList()
                process.stdout.write(`\nYou are currently in ${currentDir}\n`);
                break;
            case 'cat':
                if (!arg) {
                    console.error('\nFile name required\n');
                    return main(question);
                }
                handleReadFile(arg?? '').catch((error) => {
                    console.error(`\n${error.message}`);
                })
                .finally(() => {
                    process.stdout.write(`\nYou are currently in ${currentDir}\n`);
                    main(question);
                });
                break;
            default:
                rl.write('Invalid input' + '\n')
        }
        main(question)
    })
}

main("Enter command: ")

