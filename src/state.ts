import { createInterface, type Interface } from "readline";
import { commandExit } from "./command_exit.js";
import { commandHelp } from "./command_help.js";
import { commandMap } from "./command_map.js";

export type Command = {
  name: string;
  description: string;
  callback: (state: State) => void;
};

export type State = {
  rl: Interface;
  commands: Record<string, Command>;
  offset?: number;
};

export function initState (): State {
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
    },
    map: {
      name: "map",
      description: "Displays the names of the 20 location areas in the Pokemon world",
      callback: commandMap,
    },
  };

  return { rl, commands };
}
