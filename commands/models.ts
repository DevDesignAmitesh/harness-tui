import fs from "fs";

import { Command } from "commander";

export type ModelType = "claude" | "openai" | "gemini"

export const modelsCommand = new Command("models")
  .description('Returns all the supported models')
  .option('-m, --model <modelName>', 'name of the model', 'all')
  .action((options: {
    model: ModelType
  }) => {
    const data = JSON.parse(fs.readFileSync("models.json").toString());

    if (Object.keys(data).includes(options.model)) {
      console.log(data[options.model]);
    } else {
      console.log("wrong bruhh")
    }
    
});