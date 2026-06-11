import fs from "fs";
import { Command } from 'commander';

export const setProviderCommand = new Command("set")
    .description('Lets user set the default provider')
    .option('-p, --provider <provider>', 'Name of the provider (gemini, claude etc)', '')
    .action((options) => {
        fs.writeFileSync("default.json", JSON.stringify({ provider: options.provider }))
        console.log("provider is  " + JSON.stringify(options.provider))
    })
