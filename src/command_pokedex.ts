import { type State } from "./state.js";

const yellow = "\x1b[33m";
const green = "\x1b[32m";
const red = "\x1b[31m";
const reset = "\x1b[0m";

export async function commandPokedex(state: State, ...args: string[]): Promise<void>{
  const caught = Object.keys(state.pokedex);

  if (caught.length === 0) {
    console.log(`${red}You haven't caught any Pokemon yet!${reset}`);
    console.log("Try exploring a location area first.");
    return;
  }

  console.log(`${yellow}Your Pokedex:${reset}`);
  caught.forEach((name: string) => {
    console.log(`- ${green}${name}${reset}`);
  });
  console.log(`\nTotal: ${caught.length} Pokemon caught`);
}
