import { Command } from "./command.js"

export function commandHelp(commands: Record<string, Command>): void {
  console.log("Welcome to the Pokedex!");
  console.log("Usage:\n");
  for (const command of Object.values(commands)){
    console.log(`${command.name}: ${command.description}`);
  }
  console.log();
}
