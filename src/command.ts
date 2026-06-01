export type Command = {
  name: string;
  description: string;
  callback: (commands: Record<string, Command>) => void;
};
