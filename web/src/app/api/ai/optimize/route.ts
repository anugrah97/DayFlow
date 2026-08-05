import { getToken } from "next-auth/jwt"
import { optimizeDaySchedule } from "@/lib/claude"
import { getTodaysEvents } from "@/lib/google-calendar"
import { getSafeErrorMessage, rateLimit } from "@/lib/rate-limit"
import type { Task } from "@/store/planner"
import { NextRequest, NextResponse } from "next/server"

const RATE_LIMIT = 5
const RATE_WINDOW_MS = 60_000
const MAX_TASKS_PER_REQUEST = 50

interface OptimizeRequestBody {
  tasks: Pick<Task, "id" | "title" | "duration" | "priority">[]
}

export async function POST(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!token?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const rateLimitKey = `optimize:${token.sub ?? "unknown"}`
  const limit = rateLimit(rateLimitKey, RATE_LIMIT, RATE_WINDOW_MS)
  if (!limit.success) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter ?? 60) } }
    )
  }

  let body: OptimizeRequestBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  if (!Array.isArray(body.tasks)) {
    return NextResponse.json({ error: "tasks array is required" }, { status: 400 })
  }

  if (body.tasks.length === 0) {
    return NextResponse.json({ error: "No tasks to optimize" }, { status: 400 })
  }

  if (body.tasks.length > MAX_TASKS_PER_REQUEST) {
    return NextResponse.json({ error: "Too many tasks in request" }, { status: 400 })
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "AI optimization is not configured (missing ANTHROPIC_API_KEY)" },
      { status: 503 }
    )
  }

  try {
    const events = await getTodaysEvents(token.accessToken as string)
    const result = await optimizeDaySchedule(events, body.tasks as Task[])
    return NextResponse.json(result)
  } catch (error) {
    console.error("AI optimize error:", { message: getSafeErrorMessage(error) })
    return NextResponse.json({ error: "Failed to optimize schedule" }, { status: 500 })
  }
}
