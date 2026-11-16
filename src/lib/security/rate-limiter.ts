/**
 * Sliding Window Token Bucket Rate Limiter
 * Mitigates API exhaustion and DoS vector attempts.
 */

import { SECURITY_CONFIG } from '../../config/security.js';

interface ClientTokenBucket {
  tokens: number;
  lastRefillTimestamp: number;
}

export class RateLimiter {
  private buckets: Map<string, ClientTokenBucket>;
  private maxTokens: number;
  private refillRatePerMs: number;

  constructor(
    windowMs: number = SECURITY_CONFIG.RATE_LIMIT.WINDOW_MS,
    maxRequests: number = SECURITY_CONFIG.RATE_LIMIT.MAX_REQUESTS_PER_WINDOW
  ) {
    this.buckets = new Map();
    this.maxTokens = maxRequests;
    this.refillRatePerMs = maxRequests / windowMs;
  }

  /**
   * Evaluates if a request from a client key is permitted
   * @param clientIdentifier IP address or session identifier
   * @param tokensRequested Number of tokens required (default 1)
   */
  public checkRateLimit(
    clientIdentifier: string,
    tokensRequested: number = 1
  ): {
    isAllowed: boolean;
    remainingTokens: number;
    retryAfterMs: number;
  } {
    const now = Date.now();
    let bucket = this.buckets.get(clientIdentifier);

    if (!bucket) {
      bucket = {
        tokens: this.maxTokens,
        lastRefillTimestamp: now,
      };
      this.buckets.set(clientIdentifier, bucket);
    } else {
      // Refill tokens based on elapsed time
      const elapsedMs = now - bucket.lastRefillTimestamp;
      const refilledTokens = elapsedMs * this.refillRatePerMs;
      bucket.tokens = Math.min(this.maxTokens, bucket.tokens + refilledTokens);
      bucket.lastRefillTimestamp = now;
    }

    if (bucket.tokens >= tokensRequested) {
      bucket.tokens -= tokensRequested;
      return {
        isAllowed: true,
        remainingTokens: Math.floor(bucket.tokens),
        retryAfterMs: 0,
      };
    }

    const missingTokens = tokensRequested - bucket.tokens;
    const retryAfterMs = Math.ceil(missingTokens / this.refillRatePerMs);

    return {
      isAllowed: false,
      remainingTokens: 0,
      retryAfterMs,
    };
  }

  public reset(clientIdentifier?: string): void {
    if (clientIdentifier) {
      this.buckets.delete(clientIdentifier);
    } else {
      this.buckets.clear();
    }
  }
}
