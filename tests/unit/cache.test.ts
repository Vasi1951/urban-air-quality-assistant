import { describe, it, expect } from 'vitest';
import { LRUCache } from '../../src/lib/cache.js';

describe('LRUCache Unit Tests', () => {
  it('should store and retrieve values within TTL', () => {
    const cache = new LRUCache<string>(3, 10);
    cache.set('city_delhi', 'AQI_350');

    expect(cache.get('city_delhi')).toBe('AQI_350');
    expect(cache.has('city_delhi')).toBe(true);
    expect(cache.getStats().hits).toBe(1);
  });

  it('should respect LRU capacity and evict oldest key', () => {
    const cache = new LRUCache<number>(2, 100);
    cache.set('a', 1);
    cache.set('b', 2);
    // Access 'a' so 'b' becomes the oldest
    cache.get('a');
    cache.set('c', 3); // should evict 'b'

    expect(cache.get('a')).toBe(1);
    expect(cache.get('b')).toBeNull();
    expect(cache.get('c')).toBe(3);
    expect(cache.getStats().evictions).toBe(1);
  });

  it('should expire items after TTL elapsed', async () => {
    const cache = new LRUCache<string>(5, 0.05); // 50ms TTL
    cache.set('temp_key', 'temp_val');
    expect(cache.get('temp_key')).toBe('temp_val');

    await new Promise((resolve) => setTimeout(resolve, 60));
    expect(cache.get('temp_key')).toBeNull();
  });
});

