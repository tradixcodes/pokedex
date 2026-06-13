import { type State } from "./state.js";

const cyan   = "\x1b[36m";
const reset = "\x1b[0m";

export async function commandMap(state: State, ...args: string[]): Promise<void> {
  // fetches 20 locations - uses state.nextURL if it exists, otherwise fetches page 1
  const data = await state.pokeapi.fetchLocations(state.nextURL);

  // stores the next page URL for when the user runs "map" again
  // ?? undefined converts null (what the API returns) to undefined (what our type expects)
  // the API response includes a next and prevous field that automatically gives us the next and previous pages to store at state.nextURL and state.previousURL
  state.nextURL = data.next ?? undefined;

  // stores the previous page URL for when the user runs "mapb"
  state.previousURL = data.previous ?? undefined;

  data.results.forEach((location: {name: string; url: string}) => {
    console.log(`${cyan}${location.name}${reset}`);
  });

  state.rl.prompt();
}
