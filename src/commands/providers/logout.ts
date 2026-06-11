import fs from "fs";
import { Command } from 'commander';

export const logoutCommand = new Command("logout")
    .description('Lets user logout from the provider')
    .option('-p, --provider <provider>', 'Name of the provider (gemini, claude etc)', '')
    .action((options) => {
        const data = JSON.parse(fs.readFileSync("api.json").toString())
        
        if (data[options.provider]) {
            delete data[options.provider]
            fs.writeFileSync("api.json", JSON.stringify(data))
            console.log("logging out for provider " + options.provider)
        }
        
    })

