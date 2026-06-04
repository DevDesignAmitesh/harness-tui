import fs from "fs";
import { Command } from "commander";
import axios from "axios";
import { system_prompt } from "../system-prompt";
import { TOOLS } from "../tools";

const USER_MESSAGES: string[] = []


export const agentCommand = new Command("agent")
  .description('Runs the agent')
  .option('-p, --prompt <prompt>', 'prompt', '')
  .action(async (options) => {
    const provider = JSON.parse(fs.readFileSync("default.json").toString()).provider;
    const apikey = JSON.parse(fs.readFileSync("api.json").toString())[provider]
    // console.log("User prompt is ..." + options.prompt);
    // console.log("User provider is ..." + provider);
    // console.log("User api key is ..." + apikey);

    USER_MESSAGES.push(`
      <USER_QUERY>  
        ${options.prompt}
      <USER_QUERY>  
    `)
    
    let toolRequired = true;
    
    while (toolRequired) {
      const response = await axios.post("https://api.openai.com/v1/responses", {
        "model": "gpt-5.4-mini",
        "input": [
          { role: "system", content: `
            <SYSTEM_PROMT> ${system_prompt} <SYSTEM_PROMT>
            <AVAILABLE_TOOLS> ${JSON.stringify(TOOLS)} <AVAILABLE_TOOLS>
            ` },
          { role: "user", content: JSON.stringify(USER_MESSAGES) } 
        ],
      }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apikey}`
        },
      })
  
      let parsedResponse
      
      try {
        parsedResponse  =JSON.parse(response.data.output[0].content[0].text).output;
        // console.log("response from AI");
        // console.log(parsedResponse);
      } catch {
        // console.log("response from AI");
        // console.log(parsedResponse);
        break;
      }

      if (parsedResponse.response) {
        USER_MESSAGES.push(`
          <ASSISTANT_RESPONSE>
            ${parsedResponse.response}
          <ASSISTANT_RESPONSE>
        `)
        console.log("final message is")
        console.log(parsedResponse.response)
        toolRequired = false
        // break;
      } else if (parsedResponse.toolRequired) {
        const { toolId, params } = parsedResponse.toolRequired;
        const toolToUse = TOOLS.find((td) => td.id === toolId)!

        console.log("tools getting called", toolToUse.name);

        USER_MESSAGES.push(`
          <TOOL_USED>
            ${JSON.stringify(toolToUse)}
          <TOOL_USED>
        `)

        const toolResponse = toolToUse.function(params);

        USER_MESSAGES.push(`
          <TOOL_RESPONSE>
            ${JSON.stringify(toolResponse)}
          <TOOL_RESPONSE>
        `)
      }
    }
    
    
  });