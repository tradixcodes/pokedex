import { initState, type State } from "./state.js"

export function cleanInput(input: string): string[]{
  return input.trim().split(/\s+/).filter(Boolean).map(word => word.toLowerCase());
}

export function startREPL(state: State): void {
  state.rl.prompt();

  state.rl.on("line", (input: string) => {
    const parsedInput = cleanInput(input);
    
    if (!parsedInput.length){
     state.rl.prompt();
      return;
    }
    
    const commandName = parsedInput[0];
    const command = state.commands[commandName];

    if (command){
      command.callback(state);
    } else {
      console.log(`Unknown command: ${commandName}`);
    }

    state.rl.prompt();
});

  state.rl.on("close", () => {
    process.exit(0);
  });
}
