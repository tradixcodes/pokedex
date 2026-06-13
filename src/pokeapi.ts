import { Cache } from "./pokecache.js";

export class PokeAPI {
  private static readonly baseURL = "https://pokeapi.co/api/v2";
  private cache: Cache;

  constructor() {
    this.cache = new Cache(5 * 60 * 1000); // 5min in milliseconds
  }

  async fetchLocations(pageURL?: string): Promise<ShallowLocations>{
    const url = pageURL ?? `${PokeAPI.baseURL}/location-area?limit=20&offset=0`;
    
    const cached = this.cache.get<ShallowLocations>(url);
    if (cached) return cached;
    
    const response = await fetch(url);
    if (!response.ok){
      throw new Error(`Failed to fetch locations: ${response.statusText}`);
    }
    const data: ShallowLocations = await response.json();
    this.cache.add(url, data);
    return data;
  }

  async fetchLocation(locationName: string): Promise<LocationArea> {
    const url = `${PokeAPI.baseURL}/location-area/${locationName}`;

    const cached = this.cache.get<LocationArea>(url);
    if (cached) return cached;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error (`Failed to fetch location "${locationName}": ${response.statusText}`);
    }
    const data: LocationArea = await response.json();
    this.cache.add(url, data);
    return data;
  }

  async fetchPokemon(pokemonName: string): Promise<Pokemon>{
    const url = `${PokeAPI.baseURL}/pokemon/${pokemonName}`;
    const cached = this.cache.get<Pokemon>(url);
    if (cached) return cached;

  const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch pokemon "${pokemonName}": ${response.statusText}`);
    }
    const data: Pokemon = await response.json();
    this.cache.add(url, data);
    return data;
  }
}

export type ShallowLocations = {
  count: number;
  next: string | null;
  previous: string | null;
  results: { name: string; url: string }[];
};

export type LocationArea = {
  id: number;
  name: string;
  game_index: number;
  encounter_method_rates: {
    encounter_method: { name: string; url: string };
    version_details: {
      rate: number;
      version: { name: string; url: string };
    }[];
  }[];
  location: { name: string; url: string };
  names: {
    language: { name: string; url: string };
    name: string;
  }[];
  pokemon_encounters: {
    pokemon: { name: string; url: string };
    version_details: {
      version: { name: string; url: string };
      max_chance: number;
      encounter_details: {
        min_level: number;
        max_level: number;
        chance: number;
        method: { name: string; url: string };
      }[];
    }[];
  }[];
};

export type Pokemon = {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  weight: number;
  stats: {
    base_stat: number;
    stat: { name: string; url: string };
  }[];
  types: {
    slot: number;
    type: { name: string; url: string };
  }[];
};
