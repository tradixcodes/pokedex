import { cleanInput } from "./repl.ts";

import { describe, expect, test } from "vitest";

describe.each([
  {
    input: "  hello  world   ",
    expected: ["hello", "world"],
  },
  {
    input: " Charmander Bulbasaur  PIKACHU  ",
    expected: ["charmander", "bulbasaur", "pikachu"],
  }
])("cleanInput($input)", ({ input, expected }) => {
    test(`Expected: ${expected}`, () => {
      const actual = cleanInput(input);
      expect(actual).toHaveLength(expected.length);
      for (const i in expected) {
        expect(actual[i]).toBe(expected[i]);
      }
    });
  });
