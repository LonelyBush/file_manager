
import { access, readdir, stat, } from 'fs/promises';
import path from 'path';
import { state } from '../main.mjs';

export const moveUp = () => {
    const parentDir = path.dirname(state.currentDir);
    if (parentDir !== state.currentDir) {
        state.currentDir = parentDir;
    } else {
      console.log('You are already in root folder');
    }
}

export const moveDown = async (sourcePath) => {
    const newPath = path.join(state.currentDir, sourcePath)

    try {
        await access(path.normalize(newPath));
        const dirent = await stat(path.normalize(newPath))

        if(dirent.isDirectory()){
            state.currentDir = path.normalize(newPath);
        } else {
            throw new Error('You`ve tried to navigate on file !')
        }
      } catch(err) {
        console.error(`\n${err}\n`);
      }

}

export const handleList = async () => {
    const directory = await readdir(state.currentDir, {withFileTypes: true});
    console.table(directory.map(d => ({ Name: d.name, Type: d.isDirectory() ? 'directory' : 'file' }))
    .sort((a, b) => a.Type.localeCompare(b.Type) || a.Name.localeCompare(b.Name)));
}