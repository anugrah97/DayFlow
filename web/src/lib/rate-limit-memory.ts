type Bucket = { count: number; resetAt: number }

const memoryBuckets = new Map<string, Bucket>()

export interface RateLimitResult {
  success: boolean
  retryAfter?: number
}

export function inMemoryRateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now()
  const bucket = memoryBuckets.get(key)

  if (!bucket || now >= bucket.resetAt) {
    memoryBuckets.set(key, { count: 1, resetAt: now + windowMs })
    return { success: true }
  }

  if (bucket.count >= limit) {
    return { success: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) }
  }

  bucket.count += 1
  return { success: true }
}
