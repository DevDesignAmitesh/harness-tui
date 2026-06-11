import fs from "fs";
import { Command } from 'commander';

export const loginCommand = new Command("login")
    .description('Lets user login into the provider (use it as default)')
    .option('-p, --provider <provider>', 'Name of the provider (gemini, claude etc)', '')
    .option('-a, --api_key <apiKey>', 'Your api key', '')
    .action((options) => {
        const data: Record<string, string> = {}
        data[options.provider] = options.api_key

        fs.writeFileSync("api.json", JSON.stringify(data))
    })
