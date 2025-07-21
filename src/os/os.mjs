import os from 'os'

export const getEOL = () => {
    console.log(`\nDefault EOL is ${JSON.stringify(os.EOL)}\n`)
}

export const getCPUS = () => {
    const maped = os.cpus().map((elem) => ({model: elem.model, clock_rate: `${(elem.speed / 1000).toFixed(2)}GHz`}));
    console.table(maped);
    console.log(`\n Overall cores: ${maped.length} pcs`)
}

export const getHomeDir = () => {
    console.log(`\nHome DIR is on ${os.homedir()}`);
}

export const getUsername = () => {
    console.log(`\nYour username is ${os.userInfo().username}`);
}

export const getArch = () => {
    console.log(`\nYour CPU architecture is ${os.arch()}`);
}

