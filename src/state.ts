import { createInterface, type Interface } from "readline";
import { commandExit } from "./command_exit.js";
import { commandHelp } from "./command_help.js";

export type Command = {
  name: string;
  description: string;
  callback: (state: State) => void;
};

export type State = {
  rl: Interface;
  commands: Record<string, Command>;
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
  };

  return { rl, commands };
}
