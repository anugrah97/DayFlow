/**
 * @jest-environment node
 */
import { POST } from "../route"
import { getToken } from "next-auth/jwt"
import { optimizeDaySchedule } from "@/lib/claude"
import { getTodaysEvents } from "@/lib/google-calendar"
import { rateLimit } from "@/lib/rate-limit"
import { NextRequest } from "next/server"

jest.mock("@/lib/claude")
jest.mock("@/lib/google-calendar")
jest.mock("@/lib/rate-limit")

const mockGetToken = getToken as jest.MockedFunction<typeof getToken>
const mockOptimize = optimizeDaySchedule as jest.MockedFunction<typeof optimizeDaySchedule>
const mockGetTodaysEvents = getTodaysEvents as jest.MockedFunction<typeof getTodaysEvents>
const mockRateLimit = rateLimit as jest.MockedFunction<typeof rateLimit>

const validTask = {
  id: "task-1",
  title: "Write report",
  duration: 30,
  priority: "medium",
}

function makeRequest(body: unknown) {
  return new NextRequest("http://localhost/api/ai/optimize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}

describe("POST /api/ai/optimize", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.NEXTAUTH_SECRET = "test-secret"
    process.env.ANTHROPIC_API_KEY = "test-key"
    mockRateLimit.mockResolvedValue({ success: true })
    mockGetTodaysEvents.mockResolvedValue([])
  })

  it("returns 401 without auth", async () => {
    mockGetToken.mockResolvedValue(null)
    const res = await POST(makeRequest({ tasks: [validTask] }))
    expect(res.status).toBe(401)
  })

  it("returns 400 for invalid task payload", async () => {
    mockGetToken.mockResolvedValue({ sub: "u1", accessToken: "tok" } as never)
    const res = await POST(makeRequest({ tasks: [{ ...validTask, duration: 5 }] }))
    expect(res.status).toBe(400)
  })

  it("returns 503 when Anthropic is not configured", async () => {
    delete process.env.ANTHROPIC_API_KEY
    mockGetToken.mockResolvedValue({ sub: "u1", accessToken: "tok" } as never)
    const res = await POST(makeRequest({ tasks: [validTask] }))
    expect(res.status).toBe(503)
  })

  it("returns sanitized suggestions from Claude", async () => {
    mockGetToken.mockResolvedValue({ sub: "u1", accessToken: "tok" } as never)
    const slot = new Date()
    slot.setHours(10, 0, 0, 0)

    mockOptimize.mockResolvedValue({
      suggestions: [
        {
          taskId: "task-1",
          scheduledAt: slot.toISOString(),
          reason: "Morning focus",
        },
        {
          taskId: "unknown-task",
          scheduledAt: slot.toISOString(),
          reason: "Should be dropped",
        },
      ],
      summary: "Planned morning work",
    })

    const res = await POST(makeRequest({ tasks: [validTask] }))
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.suggestions).toHaveLength(1)
    expect(body.suggestions[0].taskId).toBe("task-1")
    expect(mockOptimize).toHaveBeenCalled()
  })
})
