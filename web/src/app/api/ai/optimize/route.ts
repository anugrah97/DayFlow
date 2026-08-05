import { getToken } from "next-auth/jwt"
import { optimizeDaySchedule } from "@/lib/claude"
import { getTodaysEvents } from "@/lib/google-calendar"
import type { Task } from "@/store/planner"
import { NextRequest, NextResponse } from "next/server"

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
    console.error("AI optimize error:", error)
    const message = error instanceof Error ? error.message : "Failed to optimize schedule"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
