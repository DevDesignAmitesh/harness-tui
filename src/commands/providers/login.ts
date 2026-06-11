import fs from "fs";
import { Command } from 'commander';

export const loginCommand = new Command("login")
    .description('Lets user login into the provider (use it as default)')
    .option('-p, --provider <provider>', 'Name of the provider (gemini, claude etc)', '')
    .option('-a, --api_key <apiKey>', 'Your api key', '')
    .action((options) => {
        const data = JSON.parse(fs.readFileSync("./src/api.json").toString());
        
        const updatedData: Record<string, string> = data;
        updatedData[options.provider] = options.api_key

        fs.writeFileSync("./src/api.json", JSON.stringify(updatedData))

        console.log("provider with api_key set");
    })
