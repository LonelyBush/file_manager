
import {createInterface} from 'readline';
import os from 'os';
import { handleList, moveDown, moveUp } from './navigation/navigation.mjs';
import { handleReadFile } from './filesOperation/readFile.mjs';
import { handleAddFile } from './filesOperation/addFile.mjs';
import { handleAddDir } from './filesOperation/addDir.mjs';
import { handleRenameFile } from './filesOperation/renameFile.mjs';
import { handleCopyFile } from './filesOperation/copyFiles.mjs';
import { handleMoveFile } from './filesOperation/moveFiles.mjs';
import { handleDeleteFile } from './filesOperation/deleteFile.mjs';

export const state = {
    currentDir: os.homedir()
}

const parseUsername = () => {
    if(process.argv[2] === undefined || !process.argv[2].includes('username')){
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
process.stdout.write(`\nYou are currently in ${state.currentDir}\n`);

rl.on('SIGINT', () => {
    console.log('\n'+`Thank you for using File Manager, ${userName}, goodbye!`)
    rl.close();
})

function main(question) {

    rl.question(question, async (answer) => {
        const {currentDir} = state
        const [command, arg, arg2] = answer.split(' ');

        switch (command){
            case '.exit':
                console.log(`Thank you for using File Manager, ${userName}, goodbye!`)
                process.exit(0)
            case 'up':
                moveUp();
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
                    console.log(`\nYou are currently in ${currentDir}\n`);
                    main(question);
                });
                break;
            case 'add':
                if (!arg) {
                    console.error('\nFile name required\n');
                    return main(question);
                }
                handleAddFile(arg?? '')
                .then((res) => {
                    console.log(res)
                })
                .catch((error) => {
                    console.error(`\n${error.message}`);
                })
                .finally(() => {
                    console.log(`\nYou are currently in ${currentDir}\n`);
                    main(question);
                });
                break;
            case 'mkdir':
                if (!arg) {
                    console.error('\nDir name is required\n');
                    return main(question);
                }
                handleAddDir(arg?? '')
                .then((res) => {
                    console.log(res)
                })
                .catch((error) => {
                    console.error(`\n${error.message}`);
                })
                .finally(() => {
                    console.log(`\nYou are currently in ${currentDir}\n`);
                    main(question);
                });
                break;
            case 'rn':
                if (!arg || !arg2) {
                    console.error('\nInvalid input\n');
                    return main(question);
                }
                handleRenameFile(arg?? '', arg2)
                .then((res) => {
                    console.log(res)
                })
                .catch((error) => {
                    console.error(`\n${error.message}`);
                })
                .finally(() => {
                    console.log(`\nYou are currently in ${currentDir}\n`);
                    main(question);
                });
                break;
            case 'copy':
                if (!arg || !arg2) {
                    console.error('\nInvalid input\n');
                    return main(question);
                }
                handleCopyFile(arg?? '', arg2)
                .then((res) => {
                    console.log(res)
                })
                .catch((error) => {
                    console.error(`\n${error.message}`);
                })
                .finally(() => {
                    console.log(`\nYou are currently in ${currentDir}\n`);
                    main(question);
                });
                break;
            case 'mv':
                if (!arg || !arg2) {
                    console.error('\nInvalid input\n');
                    return main(question);
                }
                handleMoveFile(arg?? '', arg2)
                .then((res) => {
                    console.log(res)
                })
                .catch((error) => {
                    console.error(`\n${error.message}`);
                })
                .finally(() => {
                    console.log(`\nYou are currently in ${currentDir}\n`);
                    main(question);
                });
                break;
            case 'rm':
                if (!arg) {
                    console.error('\nFile name required\n');
                    return main(question);
                }
                handleDeleteFile(arg?? '')
                .then((res) => {
                    console.log(res)
                })
                .catch((error) => {
                    console.error(`\n${error.message}`);
                })
                .finally(() => {
                    console.log(`\nYou are currently in ${currentDir}\n`);
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

