import { mkdir, } from 'fs';
import path from 'path';
import { state } from '../main.mjs';


export const handleAddDir = async (sourcePath) => {
    const {currentDir} = state;
    const newPath = path.join(currentDir, sourcePath)

    if(sourcePath.split('/').length > 1){
        throw new Error('You can add folder only in your current directory');
    }

    return new Promise((resolve, reject) => {
           mkdir(newPath, (err) => {
            if(err) {
                reject(err);
            } else {
                resolve(`\nNew folder ${sourcePath} has been added\n`)
            }
           });
        })
}