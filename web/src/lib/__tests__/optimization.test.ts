import {
  buildOptimizeUserMessage,
  parseOptimizeResponse,
  type OptimizeResponse,
} from "../optimization"

describe("parseOptimizeResponse", () => {
  const valid: OptimizeResponse = {
    suggestions: [
      {
        taskId: "task-1",
        scheduledAt: "2026-08-05T09:00:00.000Z",
        reason: "Morning focus block",
      },
    ],
    summary: "Scheduled high-priority work before meetings",
  }

  it("parses raw JSON", () => {
    const result = parseOptimizeResponse(JSON.stringify(valid))
    expect(result.suggestions).toHaveLength(1)
    expect(result.suggestions[0].taskId).toBe("task-1")
    expect(result.summary).toBe(valid.summary)
  })

  it("parses JSON wrapped in markdown fences", () => {
    const wrapped = "```json\n" + JSON.stringify(valid) + "\n```"
    const result = parseOptimizeResponse(wrapped)
    expect(result.suggestions[0].reason).toBe("Morning focus block")
  })

  it("defaults missing reason to empty string", () => {
    const payload = { suggestions: [{ taskId: "a", scheduledAt: "2026-08-05T10:00:00.000Z" }] }
    const result = parseOptimizeResponse(JSON.stringify(payload))
    expect(result.suggestions[0].reason).toBe("")
  })

  it("throws when suggestions array is missing", () => {
    expect(() => parseOptimizeResponse('{"summary":"hi"}')).toThrow(/missing suggestions/)
  })
})

describe("buildOptimizeUserMessage", () => {
  it("includes events and tasks in the payload", () => {
    const message = buildOptimizeUserMessage(
      [{ id: "e1", title: "Standup", start: "2026-08-05T10:00:00Z", end: "2026-08-05T10:30:00Z", attendeeCount: 3 }],
      [{ id: "t1", title: "Write report", duration: 60, priority: "high" }]
    )
    expect(message).toContain("Standup")
    expect(message).toContain("Write report")
    expect(message).toContain("t1")
  })
})
