import {
  sanitizeOptimizeResponse,
  validateOptimizeTasks,
} from "../optimize-validation"

const validTask = {
  id: "task-1",
  title: "Write report",
  duration: 30,
  priority: "medium" as const,
}

describe("validateOptimizeTasks", () => {
  it("accepts valid tasks", () => {
    const result = validateOptimizeTasks([validTask])
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.tasks).toHaveLength(1)
    }
  })

  it("rejects empty title", () => {
    const result = validateOptimizeTasks([{ ...validTask, title: "   " }])
    expect(result.ok).toBe(false)
  })

  it("rejects title over max length", () => {
    const result = validateOptimizeTasks([{ ...validTask, title: "x".repeat(201) }])
    expect(result.ok).toBe(false)
  })

  it("rejects invalid duration", () => {
    expect(validateOptimizeTasks([{ ...validTask, duration: 10 }]).ok).toBe(false)
    expect(validateOptimizeTasks([{ ...validTask, duration: 240 }]).ok).toBe(false)
  })

  it("rejects invalid priority", () => {
    const result = validateOptimizeTasks([{ ...validTask, priority: "urgent" }])
    expect(result.ok).toBe(false)
  })
})

describe("sanitizeOptimizeResponse", () => {
  const submitted = [validTask]

  it("keeps valid suggestions for submitted tasks", () => {
    const d = new Date()
    d.setHours(10, 0, 0, 0)
    const result = sanitizeOptimizeResponse(
      {
        suggestions: [
          {
            taskId: "task-1",
            scheduledAt: d.toISOString(),
            reason: "Morning focus",
          },
        ],
      },
      submitted
    )
    expect(result.suggestions).toHaveLength(1)
  })

  it("drops unknown task ids", () => {
    const d = new Date()
    d.setHours(10, 0, 0, 0)
    const result = sanitizeOptimizeResponse(
      {
        suggestions: [
          {
            taskId: "unknown",
            scheduledAt: d.toISOString(),
            reason: "Nope",
          },
        ],
      },
      submitted
    )
    expect(result.suggestions).toHaveLength(0)
  })

  it("drops suggestions outside grid hours", () => {
    const d = new Date()
    d.setHours(23, 0, 0, 0)
    const result = sanitizeOptimizeResponse(
      {
        suggestions: [
          {
            taskId: "task-1",
            scheduledAt: d.toISOString(),
            reason: "Too late",
          },
        ],
      },
      submitted
    )
    expect(result.suggestions).toHaveLength(0)
  })
})
