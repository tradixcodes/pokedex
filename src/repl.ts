import { createInterface } from "node:readline";
import { commandExit } from "./command_exit.js";
import { commandHelp } from "./command_help.js";
import { Command } from "./command.js";

export function cleanInput(input: string): string[]{
  return input.trim().split(/\s+/).filter(Boolean).map(word => word.toLowerCase());
}

export function startREPL() {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: ">> ",
  });

  const commands: Record<string, Command> = {
    exit: {
      name: "exit",
      description: "Exits the pokedex",
      callback: commandExit,
    },
    help: {
      name: "help",
      description: "Displays a help message",
      callback: commandHelp,
    }
  };

  rl.prompt();

  rl.on("line", (input: string) => {
    const parsedInput = cleanInput(input);
    
    if (!parsedInput.length){
     rl.prompt();
      return;
    }
    
    const commandName = parsedInput[0];
    const command = commands[commandName];

    if (command){
      command.callback(commands);
    } else {
      console.log(`Unknown command: ${commandName}`);
    }

    rl.prompt();
});

  rl.on("close", () => {
    process.exit(0);
  });
}
