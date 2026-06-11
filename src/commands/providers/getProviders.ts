import fs from "fs";
import { Command } from "commander";

export const getProvidersCommand = new Command("get")
  .description("Lets user see all the providers available")
  .action((_options) => {
    const data = JSON.parse(fs.readFileSync("./src/models.json").toString());
    console.log("below are all the suported providers");
    console.log(Object.keys(data))
    console.log("run 'bun run ./src/cli.ts model -p <provider>'");
    console.log("for viewing all the supported models");
  });
