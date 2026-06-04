import { type State } from "./state.js"

const blue   = "\x1b[34m";
const reset = "\x1b[0m";

export async function commandExit(state: State): Promise<void>{
  console.log(`${blue}Closing the Pokedex... Goodbye!${reset}`);
  state.rl.close();
}
