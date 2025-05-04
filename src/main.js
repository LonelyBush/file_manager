
import { dirname } from 'path';
import {createInterface} from 'readline';
import { fileURLToPath } from 'url';


const parseUsername = () => {
    return process.argv[2].split('=').slice(1).join('');;
}
const userName = parseUsername();

const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
})

console.log(`Welcome to the File Manager, ${userName}!` + '\n');
console.log(`You are currently in ${process.cwd()}`)

rl.on('SIGINT', () => {
    console.log('\n'+`Thank you for using File Manager, ${userName}, goodbye!`)
    rl.close();
})

function ask(question) {
    rl.question(question, async (answer) => {

        if(answer === ".exit") {
            console.log(`Thank you for using File Manager, ${userName}, goodbye!`)
            process.exit(0)
        }
        if (answer === "up"){
            process.chdir("../")
            console.log(`You are currently in ${process.cwd()}`)
        }
        if(answer.startsWith('cd')){
            try {
                const path = answer.slice(2).trim()
                process.chdir(path)
                console.log(`You are currently in ${process.cwd()}`)
            } catch(err) {
                console.log('Please enter valid path !');
            }
        }
        ask(question)
    })
}

ask("Enter command: ")

