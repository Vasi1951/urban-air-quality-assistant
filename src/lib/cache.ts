/**
 * High-Performance In-Memory LRU Cache with TTL
 * Eliminates redundant external API hits and LLM token expenditures.
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class LRUCache<T> {
  private capacity: number;
  private defaultTTLMs: number;
  private cache: Map<string, CacheEntry<T>>;
  private hits: number = 0;
  private misses: number = 0;
  private evictions: number = 0;

  constructor(capacity: number = 100, defaultTTLSeconds: number = 900) {
    this.capacity = capacity;
    this.defaultTTLMs = defaultTTLSeconds * 1000;
    this.cache = new Map<string, CacheEntry<T>>();
  }

  /**
   * Retrieves an item from cache if present and not expired
   */
  public get(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      this.misses++;
      return null;
    }

    // Check expiration
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.misses++;
      return null;
    }

    // Refresh LRU order (delete & re-insert)
    this.cache.delete(key);
    this.cache.set(key, entry);
    this.hits++;
    return entry.value;
  }

  /**
   * Stores an item with optional TTL override
   */
  public set(key: string, value: T, ttlSeconds?: number): void {
    const ttlMs = ttlSeconds !== undefined ? ttlSeconds * 1000 : this.defaultTTLMs;
    const expiresAt = Date.now() + ttlMs;

    // If key already exists, delete it first to maintain insertion order
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // Evict oldest item (first item in Map iterator)
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) {
        this.cache.delete(oldestKey);
        this.evictions++;
      }
    }

    this.cache.set(key, { value, expiresAt });
  }

  public has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) {
      return false;
    }
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }

  public clear(): void {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
    this.evictions = 0;
  }

  public size(): number {
    return this.cache.size;
  }

  public getStats(): {
    hits: number;
    misses: number;
    evictions: number;
    hitRate: number;
    size: number;
  } {
    const total = this.hits + this.misses;
    return {
      hits: this.hits,
      misses: this.misses,
      evictions: this.evictions,
      hitRate: total === 0 ? 0 : Math.round((this.hits / total) * 100) / 100,
      size: this.cache.size,
    };
  }
}

