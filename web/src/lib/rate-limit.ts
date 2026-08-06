import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { inMemoryRateLimit, type RateLimitResult } from "@/lib/rate-limit-memory"

const ratelimitCache = new Map<string, Ratelimit>()

export type { RateLimitResult } from "@/lib/rate-limit-memory"

function getRedisClient(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  return new Redis({ url, token })
}

function getRatelimiter(limit: number, windowMs: number): Ratelimit | null {
  const redis = getRedisClient()
  if (!redis) return null

  const cacheKey = `${limit}:${windowMs}`
  const cached = ratelimitCache.get(cacheKey)
  if (cached) return cached

  const ratelimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, `${windowMs} ms`),
    prefix: "dayflow:ratelimit",
  })
  ratelimitCache.set(cacheKey, ratelimiter)
  return ratelimiter
}

/**
 * Distributed rate limiter using Upstash Redis when configured.
 * Falls back to in-memory limiting for local development.
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  const ratelimiter = getRatelimiter(limit, windowMs)
  if (!ratelimiter) {
    return inMemoryRateLimit(key, limit, windowMs)
  }

  const result = await ratelimiter.limit(key)
  if (result.success) {
    return { success: true }
  }

  const retryAfter = Math.max(1, Math.ceil((result.reset - Date.now()) / 1000))
  return { success: false, retryAfter }
}

export function getSafeErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown error"
}

export function getSafeErrorCode(error: unknown): number | undefined {
  if (error && typeof error === "object" && "code" in error) {
    const code = (error as { code?: unknown }).code
    return typeof code === "number" ? code : undefined
  }
  return undefined
}
