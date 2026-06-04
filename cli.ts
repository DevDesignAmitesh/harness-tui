import { program } from 'commander';
import { modelsCommand } from './commands/models';
import { agentCommand } from './commands/agent';
import { providerCommand } from './commands/providers';

program
  .name('opencode')
  .description('Coding agent cli')
  .version('0.1.0')
  .addCommand(modelsCommand)
  .addCommand(agentCommand)
  .addCommand(providerCommand);

program.parse();
