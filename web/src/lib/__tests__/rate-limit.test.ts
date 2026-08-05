import { rateLimit } from "../rate-limit"

describe("rateLimit", () => {
  it("allows requests within the limit", () => {
    const key = `test-${Date.now()}-allow`
    expect(rateLimit(key, 3, 60_000).success).toBe(true)
    expect(rateLimit(key, 3, 60_000).success).toBe(true)
    expect(rateLimit(key, 3, 60_000).success).toBe(true)
  })

  it("blocks requests over the limit", () => {
    const key = `test-${Date.now()}-block`
    expect(rateLimit(key, 2, 60_000).success).toBe(true)
    expect(rateLimit(key, 2, 60_000).success).toBe(true)
    const blocked = rateLimit(key, 2, 60_000)
    expect(blocked.success).toBe(false)
    expect(blocked.retryAfter).toBeGreaterThan(0)
  })
})
