import { getGridBlockPosition, isWithinGridHours } from "../grid-position"

describe("getGridBlockPosition", () => {
  it("clamps tasks before grid start to the top of the grid", () => {
    const d = new Date()
    d.setHours(5, 0, 0, 0)
    const { topPx, visible } = getGridBlockPosition(d.toISOString(), 30)
    expect(topPx).toBe(0)
    expect(visible).toBe(true)
  })

  it("hides tasks that start after grid end", () => {
    const d = new Date()
    d.setHours(23, 0, 0, 0)
    const { visible } = getGridBlockPosition(d.toISOString(), 30)
    expect(visible).toBe(false)
  })

  it("positions a mid-day task within the grid", () => {
    const d = new Date()
    d.setHours(10, 0, 0, 0)
    const { topPx, heightPx, visible } = getGridBlockPosition(d.toISOString(), 60)
    expect(visible).toBe(true)
    expect(topPx).toBeGreaterThan(0)
    expect(heightPx).toBeGreaterThanOrEqual(24)
  })
})

describe("isWithinGridHours", () => {
  it("returns true for valid slots", () => {
    const d = new Date()
    d.setHours(9, 0, 0, 0)
    expect(isWithinGridHours(d.toISOString(), 30)).toBe(true)
  })

  it("returns false for slots after grid end", () => {
    const d = new Date()
    d.setHours(22, 30, 0, 0)
    expect(isWithinGridHours(d.toISOString(), 60)).toBe(false)
  })
})
