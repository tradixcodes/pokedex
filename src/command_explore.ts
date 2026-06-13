import type { State } from "./state.js";

const yellow  = "\x1b[33m";
const green   = "\x1b[32m";
const reset   = "\x1b[0m";

export async function commandExplore(state: State, ...args: string[]): Promise<void> {
  const locationName = args[0];
  if (!locationName) {
    console.log("Usage: explore <location-area>");
    return;
  }

  console.log(`Exploring ${locationName}...`);

  const location = await state.pokeapi.fetchLocation(locationName);

  if (location.pokemon_encounters.length === 0){
    console.log("No Pokemon found here.");
    return;
  }

  console.log(`${yellow}Found Pokemon:${reset}`);
  for (const encounter of location.pokemon_encounters) {
    console.log(`- ${green}${encounter.pokemon.name}${reset}`);
  }
}
