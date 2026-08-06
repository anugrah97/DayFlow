import { getToken } from "next-auth/jwt"
import { optimizeDaySchedule } from "@/lib/claude"
import { getTodaysEvents } from "@/lib/google-calendar"
import {
  OPTIMIZE_MAX_BODY_BYTES,
  sanitizeOptimizeResponse,
  validateOptimizeTasks,
} from "@/lib/optimize-validation"
import { getSafeErrorMessage, rateLimit } from "@/lib/rate-limit"
import { NextRequest, NextResponse } from "next/server"

const RATE_LIMIT = 5
const RATE_WINDOW_MS = 60_000

export async function POST(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!token?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const rateLimitKey = `optimize:${token.sub ?? "unknown"}`
  const limit = await rateLimit(rateLimitKey, RATE_LIMIT, RATE_WINDOW_MS)
  if (!limit.success) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter ?? 60) } }
    )
  }

  const contentLength = req.headers.get("content-length")
  if (contentLength && Number(contentLength) > OPTIMIZE_MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request body too large" }, { status: 413 })
  }

  let rawBody: string
  try {
    rawBody = await req.text()
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  if (rawBody.length > OPTIMIZE_MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request body too large" }, { status: 413 })
  }

  let body: unknown
  try {
    body = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const taskValidation = validateOptimizeTasks(
    body && typeof body === "object" && "tasks" in body
      ? (body as { tasks: unknown }).tasks
      : undefined
  )
  if (!taskValidation.ok) {
    return NextResponse.json({ error: taskValidation.error }, { status: 400 })
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "AI optimization is not configured (missing ANTHROPIC_API_KEY)" },
      { status: 503 }
    )
  }

  try {
    const events = await getTodaysEvents(token.accessToken as string)
    const rawResult = await optimizeDaySchedule(events, taskValidation.tasks)
    const result = sanitizeOptimizeResponse(rawResult, taskValidation.tasks)
    return NextResponse.json(result)
  } catch (error) {
    console.error("AI optimize error:", { message: getSafeErrorMessage(error) })
    return NextResponse.json({ error: "Failed to optimize schedule" }, { status: 500 })
  }
}
