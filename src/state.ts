import { createInterface, type Interface } from "readline";
import { commandExit } from "./command_exit.js";
import { commandHelp } from "./command_help.js";
import { commandMap } from "./command_map.js";
import { commandMapb } from "./command_mapb.js";
import { commandExplore } from "./command_explore.js";
import { commandCatch } from "./command_catch.js";
import { commandPokedex } from "./command_pokedex.js";
import { commandInspect } from "./command_inspect.js";
import { PokeAPI, type Pokemon, type LocationArea } from "./pokeapi.js";

// describes the shape of a single command entry
export type Command = {
  name: string;
  description: string;
  callback: (state: State, ...args: string[]) => Promise<void>;
};

// global state passed around to every command
export type State = {
  pokeapi: PokeAPI;                     // single shared API/cache instance for the whole session
  rl: Interface;                        // the readline interface (handles prompt, input, Ctrl+C/Ctrl+D)
  commands: Record<string, Command>;    // lookup table of all registered commands
  nextURL?: string;                     // URL for the next page of map results (optional)
  previousURL?: string;                 // URL for the previous page of map results (optional)
  pokedex: Record<string, Pokemon>;
  lastExploredArea?: LocationArea;      // optional especially when nothing is explored yet
};

export function initState (): State {
  // creates the readline interface - this is what prints ">> " and reads user input
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: ">> ",
  });
  
  // registers all available commands by keyword
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
    mapb: {
      name: "mapb",
      description: "Displays the previous 20 location areas",
      callback: commandMapb,
    },
    explore: {
      name: "explore",
      description: "Explore a location area to find Pokemon",
      callback: commandExplore,
    },
    catch: {
      name: "catch",
      description: "Attempt to catch a Pokemon",
      callback: commandCatch,
    },
    pokedex: {
      name: "pokedex",
      description: "Lists all the Pokemon you have caught",
      callback: commandPokedex,
    },
    inspect: {
      name: "inspect",
      description: "Inspect a caught Pokemon's details",
      callback: commandInspect,
    },
  };

  // returns the fully initialised state object
  // nextURL and previousURL are ommitted here - they start as undefined
  // and get set later by commandMap/commandMapb as the user pages through locations

  return { 
    pokeapi: new PokeAPI(), // one instance, one cache, lives for the whole session
    rl,
    commands,
    pokedex: {},
  };
}
