import { createInterface } from "node:readline";

export function cleanInput(input: string): string[]{
  return input.trim().split(/\s+/).filter(Boolean).map(word => word.toLowerCase());
}

export function startREPL() {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: ">> ",
  });

  rl.prompt();

  rl.on("line", (input: string) => {
    const parsedInput = cleanInput(input);
    if (!parsedInput.length){
     rl.prompt();
      return;
    }
    console.log(`Your command was: ${parsedInput[0]}`);
    rl.prompt();
});

  rl.on("close", () => {
    console.log("Goodbye!");
  });
}
