import { createReadStream, createWriteStream, mkdir, open, readdir, rename, writeFile } from 'fs';
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