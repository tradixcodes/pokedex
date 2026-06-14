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

  // check if the user has explored an area first
  if (!state.lastExploredArea) {
    console.log(`${red}You need to explore a location area first!${reset}`);
    console.log("Usage: explore <location-area>");
    return;
  }
  
  // check if the pokemon is actually in the last explored area
  const availablePokemon = state.lastExploredArea.pokemon_encounters.map(
    (encounter:{ pokemon: { name: string; url: string } }) => encounter.pokemon.name
  );

  if (!availablePokemon.includes(pokemonName)) {
    console.log(`${red}${pokemonName} is not available in this area!${reset}`);
    console.log(`${yellow}Available Pokemon:${reset}`);
    availablePokemon.forEach((name: string) => console.log(`- ${green}${name}${reset}`));
    return;
  }
  
  console.log(`Throwing a Pokeball at ${pokemonName}...`);

  try {
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
  } catch (error) {
  console.log(`${red}Pokemon "${pokemonName}" not found.${reset}`);
  }
}
