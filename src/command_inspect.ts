import { type State } from "./state.js";

const yellow = "\x1b[33m";
const green = "\x1b[32m";
const red = "\x1b[31m";
const cyan = "\x1b[36m";
const reset = "\x1b[0m";

export async function commandInspect(state: State, ...args: string[]): Promise<void> {
  const pokemonName = args[0];
  if (!pokemonName) {
    console.log("Usage: inspect <pokemon-name>");
    return;
  }

  const pokemon = state.pokedex[pokemonName];
  if (!pokemon) {
    console.log(`${red}You haven't caught ${pokemonName} yet!${reset}`);
    return;
  }

  console.log(`${yellow}Name: ${reset}${pokemon.name}`);
  console.log(`${yellow}Height: ${reset}${pokemon.height / 10}m`);
  console.log(`${yellow}Weight: ${reset}${pokemon.weight / 10}kg`);

  console.log(`${yellow}Types:${reset}`);
  pokemon.types.forEach(({ type }) => {
    console.log(`  - ${green}${type.name}${reset}`);
  });

  console.log(`${yellow}Stats:${reset}`);
  pokemon.stats.forEach(({ stat, base_stat }) => {
    console.log(`  - ${cyan}${stat.name}${reset}: ${base_stat}`);
  });
}
