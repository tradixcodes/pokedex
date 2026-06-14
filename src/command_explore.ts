import type { State } from "./state.js";

const yellow  = "\x1b[33m";
const green   = "\x1b[32m";
const red    = "\x1b[31m";
const reset   = "\x1b[0m";

export async function commandExplore(state: State, ...args: string[]): Promise<void> {
  const locationName = args[0];
  if (!locationName) {
    console.log("Usage: explore <location-area>");
    return;
  }

  console.log(`Exploring ${locationName}...`);

  try {
    const location = await state.pokeapi.fetchLocation(locationName);
    state.lastExploredArea = location; // store it so catch can use it to catch only pokemons on explored areas

    if (location.pokemon_encounters.length === 0){
      console.log("No Pokemon found here.");
      return;
    }

    console.log(`${yellow}Found Pokemon:${reset}`);
    for (const encounter of location.pokemon_encounters) {
      console.log(`- ${green}${encounter.pokemon.name}${reset}`);
    } 
  }
  catch (error) {
    // fetchLocation throws when the API return 404 or any non-ok response
    console.log(`${red}Location "${locationName}" not found. Try a valid location area name.${reset}`);
  }
}
