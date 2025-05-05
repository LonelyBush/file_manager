import { access } from "fs/promises";
import { state } from "../main.mjs";
import path from 'path';
import { createReadStream } from "fs";
import crypto from 'crypto';

export const calculateHash = async (sourceFile) => {
    const {currentDir} = state;
    const currentPath = path.join(currentDir, sourceFile);

     try {
            await access(currentPath);
        } catch {
            throw new Error(`ENOENT: no such file or directory, open '${currentPath}'`);
        }

        return new Promise((resolve, reject) => {
            const read = createReadStream(currentPath, { encoding: 'utf-8' });

            read.on('data', (chunk) => {
                var hash = crypto.createHash('sha256').update(chunk).digest('hex')
                console.log(`\n`);
                console.log(`\n${hash}\n`);
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