import { open, writeFile } from 'fs';
import path from 'path';
import { state } from '../main.mjs';



export const handleAddFile = async (sourcePath) => {
    const {currentDir} = state;
    const newPath = path.join(currentDir, sourcePath)

    if(sourcePath.split('/').length > 1){
        throw new Error('You can add file only in your current directory');
    }


    return new Promise((resolve, reject) => {
        open(newPath, 'r+', (err) => {
            if(err){
                return  writeFile(newPath, '', (err) => {
                    if(err){
                        reject(err);
                    }
                    return resolve(`\nFile ${sourcePath} has been created in ${currentDir}\n`)
                })
            }else {
                return reject(new Error('File already exists'))
            }
        })
    });
}