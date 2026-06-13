import { type State } from "./state.js";

const yellow = "\x1b[33m";
const green  = "\x1b[32m";
const red    = "\x1b[31m";
const reset  = "\x1b[0m";

export async function commandCatch(state: State, ...args: string[]): Promise<void> {
  const pokemonName = args[0];
  if (!pokemonName) {
    console.log("Usage: catch <pokemon-name>");
    return;
  }

  console.log(`Throwing a Pokeball at ${pokemonName}...`);

  const pokemon = await state.pokeapi.fetchPokemon(pokemonName);

  // higher base_experience = harder to catch
  // e.g. pikachu = 112, mewtwo = 340
  // chance ranges from -20% (very hard) to -90% (very easy)
  const catchChance = Math.max(0.2, 1 - pokemon.base_experience / 400);

  if (Math.random() < catchChance) {
    console.log(`${green}${pokemon.name} was caught!${reset}`);
    state.pokedex[pokemon.name] = pokemon;
  } else {
    console.log(`${red}${pokemon.name} escaped!${reset}`);
  }
}
