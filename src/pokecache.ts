type CacheEntry<T> = {
  createdAt: number;        // timestamp in ms of when tthis entry is added 
  val: T;                   // the actual data being cached, T means it can be any type
};
// this is a generic type = CacheEntry<ShallowLocations>, CacheEntry<Pokemon> etc
// T gets replaced with the real type when it's used

export class Cache {
  #cache = new Map<string, CacheEntry<any>>();
  // # means truly private - not even accessible via state.cache.#cache outside the class
  // private so that only way to interact with cache is through our specified methods {add & get}
  // public means map methods like .set(), .get(), .delete(), etc. can be used to access cache properties outside the specified methods

  // Map<string, CacheEntry<any>> means:
  // keys -> strings (our URLs)
  // values -> CacheEntry objects holding the cached data

  #reapIntervalId: NodeJS.Timeout | undefined = undefined;
  // stores the ID returned by setInterval so we can cancel it later with clearInterval
  // starts as undefined because the loop hasn't started yet
  // NodeJS.Timeout us the type TypeScript uses for the setInterval return object(in backend) a value on the browser
  
  #interval: number;
  // how long in milliseconds before an entry is considered expired
  // also used as the delay between each reap cycle

  constructor(interval: number) {
    this.#interval = interval;    // stores the interval e.g. 300,000 for 5 minutes
    this.#startReapLoop();        // immediately starts the cleanup loop
  }

  add<T>(key: string, val: T): void {
    this.#cache.set(key, {
      createdAt: Date.now(), // stamps exactly when this entry was added
      val,                  
    });
    // if the key already exists, this overwrites it with a fresh entry
  }

  get<T>(key: string): T | undefined {
    const entry = this.#cache.get(key);
    if (!entry) return undefined;
    // if the key doesn't exists at all, returns undefined immediately

    return entry.val as T;
    // as T tells TypeScript "trust me, this val is of type T"
    // safe here because add<T> and get<T> are always called with matching types
  }

  #reap(): void {
    const now = Date.now();
    for (const [key, entry] of this.#cache) {
      // loops through every entry in the cache
      if (now - entry.createdAt > this.#interval) {
        // if the entry is older than the interval, delete interval
        this.#cache.delete(key);
      }
    }
  }

  #startReapLoop(): void {
    this.#reapIntervalId = setInterval(() => this.#reap(), this.#interval);
    // setInterval calls #reap() every interval milliseconds forever
    // stores the ID so stopReapLoop() can cancel it later
    // () => this.#reap() is needed instead of just this.#reap
    // because setInterval loses the class context without the arrow function wrapped
  }

  stopReapLoop(): void {
    clearInterval(this.#reapIntervalId); // cancels the setInterval using the stored ID
    this.#reapIntervalId = undefined; // cleans up the reference
    // called in tests to prevent the internal leaking between test runs
  }
}
