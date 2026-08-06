/**
 * @jest-environment node
 */
import { GET } from "../route"
import { getToken } from "next-auth/jwt"
import { getTodaysEvents } from "@/lib/google-calendar"
import { rateLimit } from "@/lib/rate-limit"
import { NextRequest } from "next/server"

jest.mock("@/lib/google-calendar")
jest.mock("@/lib/rate-limit")

const mockGetToken = getToken as jest.MockedFunction<typeof getToken>
const mockGetTodaysEvents = getTodaysEvents as jest.MockedFunction<typeof getTodaysEvents>
const mockRateLimit = rateLimit as jest.MockedFunction<typeof rateLimit>

describe("GET /api/calendar/events", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.NEXTAUTH_SECRET = "test-secret"
    mockRateLimit.mockResolvedValue({ success: true })
  })

  it("returns 401 without a valid token", async () => {
    mockGetToken.mockResolvedValue(null)
    const res = await GET(new NextRequest("http://localhost/api/calendar/events"))
    expect(res.status).toBe(401)
  })

  it("returns events for an authenticated user", async () => {
    mockGetToken.mockResolvedValue({
      sub: "user-1",
      accessToken: "google-token",
    } as never)
    mockGetTodaysEvents.mockResolvedValue([
      {
        id: "e1",
        title: "Standup",
        start: "2026-08-06T10:00:00.000Z",
        end: "2026-08-06T10:30:00.000Z",
        attendeeCount: 2,
        allDay: false,
      },
    ])

    const res = await GET(new NextRequest("http://localhost/api/calendar/events"))
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.events).toHaveLength(1)
    expect(body.syncedAt).toBeTruthy()
    expect(mockGetTodaysEvents).toHaveBeenCalledWith("google-token")
  })

  it("returns 429 when rate limited", async () => {
    mockGetToken.mockResolvedValue({
      sub: "user-1",
      accessToken: "google-token",
    } as never)
    mockRateLimit.mockResolvedValue({ success: false, retryAfter: 30 })

    const res = await GET(new NextRequest("http://localhost/api/calendar/events"))
    expect(res.status).toBe(429)
    expect(res.headers.get("Retry-After")).toBe("30")
  })
})
