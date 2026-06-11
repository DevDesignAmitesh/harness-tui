import { Command, program } from "commander";
import { loginCommand } from "./login";
import { logoutCommand } from "./logout";
import { setProviderCommand } from "./setProvider";
import { getProvidersCommand } from "./getProviders";

export const providerCommand = new Command("providers")
  .description("Provider related information")
  .addCommand(loginCommand)
  .addCommand(logoutCommand)
  .addCommand(setProviderCommand)
  .addCommand(getProvidersCommand);
