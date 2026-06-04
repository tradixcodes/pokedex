type CacheEntry<T> = {
  data: T;
  createdAt: number; // timestamp in milliseconds
};

export class PokeCache {
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private ttl: number; // in milliseconds

  constructor(ttlMs: number) {
    this.cache = new Map();
    this.ttl = ttlMs;
  }

  get<T>(url: string): T | undefined {
    const entry = this.cache.get(url);
    if (!entry) return undefined;

    const age = Date.now() - entry.createdAt;
    if (age > this.ttl) {
      this.cache.delete(url); // clean up expired entry
      return undefined;
    }

    return entry.data as T;
  }

  set<T>(url: string, data: T): void {
    this.cache.set(url, {
      data,
      createdAt: Date.now(),
    });
  }

  has(url: string): boolean {
    return this.get(url) !== undefined;
  }
}
