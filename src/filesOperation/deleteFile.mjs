import { unlink } from 'fs';
import { access } from 'fs/promises';
import path from 'path';
import { state } from '../main.mjs';

export const handleDeleteFile = async (sourceFile) => {
    const {currentDir} = state;
    const currentPath = path.join(currentDir, sourceFile);

    try {
        await access(currentPath);
    } catch {
        throw new Error(`ENOENT: no such file, open '${currentPath}'`);
    }

    return new Promise((resolve, reject) => {

        unlink(currentPath, (err) => {
            if(err){
                reject(err)
            } else {
                resolve(`\nYou have been successfully deleted file on ${currentPath}\n`)
            }
        })
        })
}