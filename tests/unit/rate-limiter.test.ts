import { describe, it, expect } from 'vitest';
import { RateLimiter } from '../../src/lib/security/rate-limiter.js';

describe('RateLimiter Unit Tests', () => {
  it('should allow requests within rate limit threshold', () => {
    const limiter = new RateLimiter(1000, 5); // 5 requests per second
    const ip = '192.168.1.1';

    for (let i = 0; i < 5; i++) {
      const res = limiter.checkRateLimit(ip);
      expect(res.isAllowed).toBe(true);
    }

    // 6th request exceeds burst capacity
    const sixth = limiter.checkRateLimit(ip);
    expect(sixth.isAllowed).toBe(false);
    expect(sixth.retryAfterMs).toBeGreaterThan(0);
  });

  it('should refill tokens over elapsed time', async () => {
    const limiter = new RateLimiter(100, 2); // 2 requests per 100ms
    const ip = '10.0.0.1';

    limiter.checkRateLimit(ip);
    limiter.checkRateLimit(ip);
    expect(limiter.checkRateLimit(ip).isAllowed).toBe(false);

    // Wait 110ms for bucket to refill
    await new Promise((resolve) => setTimeout(resolve, 110));
    expect(limiter.checkRateLimit(ip).isAllowed).toBe(true);
  });

  it('should isolate token buckets per client IP', () => {
    const limiter = new RateLimiter(1000, 2);
    limiter.checkRateLimit('client_A');
    limiter.checkRateLimit('client_A');
    expect(limiter.checkRateLimit('client_A').isAllowed).toBe(false);

    // client_B has fresh bucket
    expect(limiter.checkRateLimit('client_B').isAllowed).toBe(true);
  });
});

