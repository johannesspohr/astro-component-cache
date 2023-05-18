export class Cache {
  private entries = new Map<string, CacheEntry>();

  /**
   * @param key The cache key
   * @param value The value to cache
   * @param ttl The valid time of the entry in seconds
   */
  set(key: string, value: any, ttl: number) {
    this.entries.set(key, { ttl: Date.now() + ttl * 1000, value });
  }

  /**
   * Gets a valid value, or undefined if invalid or not present
   * @param key
   */
  get(key: string): any | undefined {
    const entry = this.entries.get(key);
    return !entry || entry.ttl < Date.now() ? undefined : entry.value;
  }
}

interface CacheEntry {
  ttl: number;
  value: any;
}
