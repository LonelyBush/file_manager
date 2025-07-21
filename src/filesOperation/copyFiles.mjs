import { createReadStream, createWriteStream } from 'fs';
import { access } from 'fs/promises';
import path from 'path';
import { state } from '../main.mjs';


export const handleCopyFile = async (sourceFile, distanation) => {
    const {currentDir} = state;
    const fileExtname = path.extname(sourceFile);
    const fileBasename = path.basename(sourceFile, fileExtname);
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

    return new Promise((resolve, reject) => {
        const fileCopyPath = path.join(copyPath, `${!fileExtname? `-copy${fileBasename}`:`${fileBasename}-copy${fileExtname}`}`)
        const inputRead = createReadStream(currentPath, { encoding: 'utf-8' });
        const outputWrite = createWriteStream(fileCopyPath)

        inputRead.pipe(outputWrite)
        outputWrite.on('finish', () => {
            resolve(`\nYou have successfully created a ${sourceFile} copy. The new file name is on ${fileCopyPath}.\n`)
        })

        outputWrite.on('error', (error) => {
            reject(error);
        });
        })
}