import { type State } from "./state.js";
import { PokeAPI } from "./pokeapi.js";

const cyan   = "\x1b[36m";
const reset = "\x1b[0m";

const pokeAPI = new PokeAPI();

export async function commandMapb(state: State): Promise<void> {
  if (!state.previousURL) {
    console.log("you're on the first page");
    state.rl.prompt();
    return;
  }

  const data = await pokeAPI.fetchLocations(state.previousURL);
  state.nextURL = data.next ?? undefined;
  state.previousURL = data.previous ?? undefined;

  data.results.forEach((location) => {
    console.log(`${cyan}${location.name}${reset}`);
  });

  state.rl.prompt();
}
