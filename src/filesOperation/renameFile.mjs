
import { rename,  } from 'fs';
import { access } from 'fs/promises';
import path from 'path';
import { state } from '../main.mjs';


export const handleRenameFile = async (sourcePath, newFile) => {
    const {currentDir} = state;
    const currentPath = path.join(currentDir, sourcePath);
    const renamePath = path.join(currentDir, newFile);
    try {
        await access(currentPath);
    } catch {
        throw new Error(`ENOENT: no such file, open '${currentPath}'`);
    }

    return new Promise((resolve, reject) => {
           rename(currentPath, renamePath, (err) => {
            if(err) {
                reject(err);
            } else {
                resolve(`\nFile at ${currentPath} has been renamed to ${renamePath}\n`)
            }
           });
        })
}