type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()

export interface RateLimitResult {
  success: boolean
  retryAfter?: number
}

/**
 * Simple in-memory sliding-window rate limiter (per-process).
 * Suitable for single-instance deployments; use Redis for multi-instance.
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { success: true }
  }

  if (bucket.count >= limit) {
    return { success: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) }
  }

  bucket.count += 1
  return { success: true }
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
