/**
 * In-memory sliding window rate limiter for API routes and Server Actions.
 * For Redis/Upstash distributed setup, this interface connects directly to Upstash REST.
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const memoryRateLimitStore = new Map<string, RateLimitRecord>();

export async function rateLimit(
  identifier: string,
  limit: number = 10,
  windowSeconds: number = 60
): Promise<{ allowed: boolean; remaining: number; reset: number }> {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const record = memoryRateLimitStore.get(identifier);

  if (!record || now > record.resetAt) {
    memoryRateLimitStore.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    });
    return { allowed: true, remaining: limit - 1, reset: Math.ceil((now + windowMs) / 1000) };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0, reset: Math.ceil(record.resetAt / 1000) };
  }

  record.count += 1;
  return { allowed: true, remaining: limit - record.count, reset: Math.ceil(record.resetAt / 1000) };
}
