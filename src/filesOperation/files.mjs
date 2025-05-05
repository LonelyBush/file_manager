
import { createReadStream, mkdir, open, readdir, writeFile } from 'fs';
import { access } from 'fs/promises';
import path from 'path';
import { state } from '../main.mjs';

export const handleReadFile = async (sourcePath) => {
    const {currentDir} = state;
    const newPath = path.join(currentDir, sourcePath)
    try {
        await access(newPath);
    } catch {
        throw new Error(`ENOENT: no such file or directory, open '${newPath}'`);
    }

    return new Promise((resolve, reject) => {
        const read = createReadStream(newPath, { encoding: 'utf-8' });

        read.on('data', (chunk) => {
            console.log(`\n`);
            console.log(`\n${chunk}\n`);
        });

        read.on('end', () => {
            console.log(`\n`);
            resolve();
        });

        read.on('error', (error) => {
            reject(error);
        });
    });
}

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
