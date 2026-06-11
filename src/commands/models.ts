import fs from "fs";
import { Command } from "commander";

export type ModelType = "openai" | "all"

export const modelsCommand = new Command("models")
  .description('Returns all the supported models')
  .option('-m, --model <modelName>', 'name of the model', 'all')
  .action((options: {
    model: ModelType
  }) => {
    const data = JSON.parse(fs.readFileSync("./src/models.json").toString());
    
    if (options.model !== "all") {
      if (Object.keys(data).includes(options.model)) {
        console.table(data[options.model]);
      } else {
        console.log(`'${options.model}' not found`)
      }
    } else {
      console.log("below are all supported providers")
      console.table(Object.keys(data));
    }
    
  });