import { type State } from "./state.js";

interface Location {
  name: string;
  url: string;
}

interface LocationResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Location[];
}

export async function commandMap(state: State): Promise<void> {
  const offset = state.offset ?? 0;
  const url = `https://pokeapi.co/api/v2/location?limit=20&offset=${offset}`;

  const response = await fetch(url);
  const data: LocationResponse = await response.json();

  state.offset = offset + 20;

  data.results.forEach((location: Location, index: number) => {
    console.log(`${location.name}`);
  })
  state.rl.prompt();
}
