import { prisma } from './prisma';

interface RateLimitEntry {
  key: string;
  count: number;
  resetAt: Date;
}

// In-memory rate limit store (for development)
// In production, consider using Redis or similar
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier for the rate limit (e.g., IP address, user ID)
 * @param maxRequests - Maximum number of requests allowed
 * @param windowMs - Time window in milliseconds
 * @returns true if rate limited, false otherwise
 */
export async function checkRateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000 // 1 minute default
): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
  const now = new Date();
  const key = `ratelimit:${identifier}`;
  
  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetAt < now) {
    // Create new entry or reset expired entry
    const resetAt = new Date(now.getTime() + windowMs);
    rateLimitStore.set(key, {
      key,
      count: 1,
      resetAt,
    });

    // Clean up expired entries periodically
    if (rateLimitStore.size > 1000) {
      for (const [k, v] of rateLimitStore.entries()) {
        if (v.resetAt < now) {
          rateLimitStore.delete(k);
        }
      }
    }

    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetAt,
    };
  }

  if (entry.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  // Increment count
  entry.count++;
  rateLimitStore.set(key, entry);

  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    resetAt: entry.resetAt,
  };
}

/**
 * Get rate limit info without incrementing
 */
export function getRateLimitInfo(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000
): { remaining: number; resetAt: Date } {
  const now = new Date();
  const key = `ratelimit:${identifier}`;
  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetAt < now) {
    const resetAt = new Date(now.getTime() + windowMs);
    return {
      remaining: maxRequests,
      resetAt,
    };
  }

  return {
    remaining: Math.max(0, maxRequests - entry.count),
    resetAt: entry.resetAt,
  };
}

