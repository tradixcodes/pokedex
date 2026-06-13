import { type State } from "./state.js"

// Takes raw user input like "  Explore   PASTORIA_CITY  "
// and returns a clean array like ["explore", "pastoria-city"]
export function cleanInput(input: string): string[]{
  return input
    .trim()                             // strips leading and trailing whitespace
    .split(/\s+/)                       // splits on one or more whitespace characters: s representing whitespace
    .filter(Boolean)                    // removes any empty strings from the array
    .map(word => word.toLowerCase());   // lowercases every word
}

export function startREPL(state: State): void {
  state.rl.prompt(); // prints "Pokedex > " to the terminal for the first time

  // fires every time a user hits Enter
  state.rl.on("line", async (input: string) => {

    // parse the raw input into a clean array of words
    const parsedInput = cleanInput(input);
   
    // if the user just hit Enter on an empty line, re-prompt and do nothing
    if (!parsedInput.length){
      state.rl.prompt();
      return;
    }

    // first word is the command name e.g. "explore"
    const commandName = parsedInput[0];

    // remaining words are arquements e.g. ["pastoria-city-area"]
    const args = parsedInput.slice(1);
    
    // look up the command in the registry
    const command = state.commands[commandName];

    if (command){
      try {
        // call the command, passing state + any extra args
        // e.g. commandExplore(state, "pastoria-city-area")
        await command.callback(state, ...args);
      } catch (err) {
        console.error(`Error running command "${commandName}":`, err);
      }
    } else {
      console.log(`Unknown command: ${commandName}`);
    }
    
    // re-print "Pokedex > ready for the next command"
    state.rl.prompt();
});

  // fires when the user hits Ctrl+C or Ctrl+D - exits cleanly
  state.rl.on("close", () => {
    process.exit(0);
  });
}
