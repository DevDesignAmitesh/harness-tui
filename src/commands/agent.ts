import fs from "fs";
import { Command } from "commander";
import axios from "axios";
import { system_prompt } from "../system-prompt";
import { TOOLS } from "../tools";

function updateUserMessage(input: string) {
  let prev_messages: string[] = []
  
  try {
    prev_messages = JSON.parse(fs.readFileSync("./src/messages.json").toString())
  } catch {
    prev_messages = []
  }

  prev_messages.push(input)
  
  fs.writeFileSync("./src/messages.json", JSON.stringify(prev_messages));
}

function getAllMessages(): string[] {
  try {
    return JSON.parse(fs.readFileSync("./src/messages.json").toString())
  } catch {
    return []
  }
}

const MAX_STEPS = 10;

export const agentCommand = new Command("agent")
  .description('Runs the agent')
  .option('-p, --prompt <prompt>', 'prompt', '')
  .action(async (options) => {
    let provider, apikey;

    try {
      provider = JSON.parse(fs.readFileSync("./src/default.json").toString()).provider;
    } catch  {
      console.log("default provider not set");
      return;
    }

    try {
      apikey = JSON.parse(fs.readFileSync("./src/api.json").toString())[provider]
    } catch {
      console.log(`api_key of ${provider} provider not found`);
      return;
    }
    // console.log("User prompt is ..." + options.prompt);
    // console.log("User provider is ..." + provider);
    // console.log("User api key is ..." + apikey);

    updateUserMessage(`
      <USER_QUERY>  
        ${options.prompt}
      <USER_QUERY>  
    `)
    
    let steps = 0;
    
    while (steps < MAX_STEPS) {
      steps += 1;

      const response = await axios.post("https://api.openai.com/v1/responses", {
        "model": "gpt-5.4-mini",
        "input": [
          { 
            role: "system", content: system_prompt 
          },
          { 
            role: "user", 
            content: JSON.stringify(getAllMessages()) 
          } 
        ],
        }, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apikey}`
          },
        }
      )
  
      let parsedResponse;
      
      try {
        parsedResponse = JSON.parse(response.data.output[0].content[0].text).output;
      } catch {
        console.log("unable to get response from AI");
        break;
      }

      if (parsedResponse.response) {
        updateUserMessage(`
          <ASSISTANT_RESPONSE>
            ${parsedResponse.response}
          <ASSISTANT_RESPONSE>
        `)
        console.log(parsedResponse.response)
        break;
      } else if (parsedResponse.toolRequired) {
        const { toolId, params } = parsedResponse.toolRequired;
        const toolToUse = TOOLS.find((td) => td.id === toolId)!

        console.log("tool getting called", toolToUse.name);

        updateUserMessage(`
          <TOOL_USED>
            ${JSON.stringify(toolToUse)}
          <TOOL_USED>
        `)

        const toolResponse = toolToUse.function(params);

        updateUserMessage(`
          <TOOL_RESPONSE>
            ${JSON.stringify(toolResponse)}
          <TOOL_RESPONSE>
        `)
      }
    }
  });