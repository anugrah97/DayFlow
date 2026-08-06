import { getToken } from "next-auth/jwt"
import { getTodaysEvents } from "@/lib/google-calendar"
import { getSafeErrorCode, getSafeErrorMessage, rateLimit } from "@/lib/rate-limit"
import { NextRequest, NextResponse } from "next/server"

const RATE_LIMIT = 10
const RATE_WINDOW_MS = 60_000

export async function GET(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!token?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const rateLimitKey = `calendar:${token.sub ?? "unknown"}`
  const limit = await rateLimit(rateLimitKey, RATE_LIMIT, RATE_WINDOW_MS)
  if (!limit.success) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter ?? 60) } }
    )
  }

  try {
    const events = await getTodaysEvents(token.accessToken as string)
    return NextResponse.json({ events, syncedAt: new Date().toISOString() })
  } catch (error) {
    console.error("Calendar fetch error:", {
      message: getSafeErrorMessage(error),
      code: getSafeErrorCode(error),
    })
    return NextResponse.json({ error: "Failed to fetch calendar" }, { status: 500 })
  }
}
