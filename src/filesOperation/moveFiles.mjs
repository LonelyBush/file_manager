
import { createReadStream, createWriteStream, unlink } from 'fs';
import { access } from 'fs/promises';
import path from 'path';
import { state } from '../main.mjs';



export const handleMoveFile = async (sourceFile, distanation) => {
    const {currentDir} = state;
    const currentPath = path.join(currentDir, sourceFile);
    const copyPath = path.join(currentDir, distanation);

    try {
        await access(currentPath);
    } catch {
        throw new Error(`ENOENT: no such file, open '${currentPath}'`);
    }

    try {
        await access(copyPath);
    } catch {
        throw new Error(`ENOENT: no such directory, open '${copyPath}'`);
    }

    if(currentPath === copyPath){
        throw new Error(`You cant move files to you current directory !`);
    }

    return new Promise((resolve, reject) => {
        const fileMovePath = path.join(copyPath, `${sourceFile}`)
        const inputRead = createReadStream(currentPath, { encoding: 'utf-8' });
        const outputWrite = createWriteStream(fileMovePath)

        inputRead.pipe(outputWrite)
        outputWrite.on('finish', () => {
            unlink(currentPath, (err) => {
                if(err){
                    reject(err)
                }
            })
            resolve(`\nYou have successfully move a ${sourceFile} and its now on ${fileMovePath}.\n`)
        })

        outputWrite.on('error', (error) => {
            reject(error);
        });
        })
}