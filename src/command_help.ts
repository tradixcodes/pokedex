import { type State } from "./state.js"

const green = "\x1b[32m";
const reset = "\x1b[0m";
// const red    = "\x1b[31m";
// const green  = "\x1b[32m";
// const yellow = "\x1b[33m";
const blue   = "\x1b[34m";
// const cyan   = "\x1b[36m";
const bold   = "\x1b[1m";

export async function commandHelp(state: State): Promise<void> {
  console.log(`${blue}${bold}Welcome to the Pokedex!${reset}`);
  console.log(`Usage:\n`);
  for (const command of Object.values(state.commands)){
    // always end with reset or the color bleeds into everything after it.
    console.log(`${green}${command.name}: ${command.description}${reset}`);
  }
  console.log();
}
