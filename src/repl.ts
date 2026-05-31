export function cleanInput(input: string): string[]{
  return input.trim().split(/\s+/).filter(Boolean).map(word => word.toLowerCase());
}
