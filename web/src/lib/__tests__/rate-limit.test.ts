import { inMemoryRateLimit } from "../rate-limit-memory"

describe("inMemoryRateLimit", () => {
  it("allows requests within the limit", () => {
    const key = `test-${Date.now()}-allow`
    expect(inMemoryRateLimit(key, 3, 60_000).success).toBe(true)
    expect(inMemoryRateLimit(key, 3, 60_000).success).toBe(true)
    expect(inMemoryRateLimit(key, 3, 60_000).success).toBe(true)
  })

  it("blocks requests over the limit", () => {
    const key = `test-${Date.now()}-block`
    expect(inMemoryRateLimit(key, 2, 60_000).success).toBe(true)
    expect(inMemoryRateLimit(key, 2, 60_000).success).toBe(true)
    const blocked = inMemoryRateLimit(key, 2, 60_000)
    expect(blocked.success).toBe(false)
    expect(blocked.retryAfter).toBeGreaterThan(0)
  })
})
