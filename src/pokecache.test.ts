import { Cache } from "./pokecache.js";
import { test, expect, describe } from "vitest";

describe("Cache", () => {
  // Test from the spec: add -> get -> wait -> reaped
  test.concurrent.each([
    { key: "https://example.com", val: "testdata", interval: 500 },
    { key: "https://example.com/path", val: "moretestdata", interval: 1000 },
  ])("reaps expired entries after $interval ms", async ({ key, val, interval }) => {
  const cache = new Cache(interval);
  cache.add(key, val);

  const cached = cache.get(key);
  expect(cached).toBe(val);

  await new Promise((resolve) => setTimeout(resolve, interval * 2));

  const reaped = cache.get(key);
  expect(reaped).toBe(undefined);

  cache.stopReapLoop();
});
  
  // get() on a key that was never added returns undefined
  test("get() returns undefined for missing key", () => {
    const cache = new Cache(5000);
    const result = cache.get("https://nowhere.com");
    expect(result).toBe(undefined);
    cache.stopReapLoop();
  });

  // add() overwrites an exsitine entry
  test("add() overwrites an existing key", () => {
    const cache = new Cache(5000);
    cache.add("https://example.com", "first");
    cache.add("https://example.com", "second");
    expect(cache.get("https://example.com")).toBe("second");
    cache.stopReapLoop();
  });

  // Different keys are independent
  test("different keys are stored independently", () => {
    const cache = new Cache(5000);
    cache.add("https://example.com/a", "alpha");
    cache.add("https://example.com/b", "beta")
    expect(cache.get("https://example.com/a")).toBe("alpha");
    expect(cache.get("https://example.com/b")).toBe("beta");
    cache.stopReapLoop();
  });

  // Works with object values, not just strings
  test("caches object values correctly", () => {
    const cache = new Cache(5000);
    const payload = { count: 3, results: ["bulbasaur", "ivysaur", "venusaur"] };
    cache.add("https://pokeapi.co/api/v2/pokemon", payload);
    const result = cache.get<typeof payload>("https://pokeapi.co/api/v2/pokemon");
    expect(result).toEqual(payload);
    cache.stopReapLoop();
  });
});
