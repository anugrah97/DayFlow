import type { CalendarEvent } from "@/lib/google-calendar"
import type { OptimizeTaskInput } from "@/lib/task-constraints"

export interface ScheduleSuggestion {
  taskId: string
  scheduledAt: string
  reason: string
}

export interface OptimizeResponse {
  suggestions: ScheduleSuggestion[]
  summary?: string
}

export const OPTIMIZE_SYSTEM_PROMPT = `You are a day planning assistant for DayFlow. Given today's calendar events and unscheduled tasks, suggest an optimized schedule.

Rules:
- Only schedule tasks between 7:00 AM and 10:00 PM local time today.
- Place high-priority tasks in morning focus blocks when possible.
- Leave at least 15 minutes buffer before and after calendar meetings.
- Do not overlap tasks with existing calendar events.
- Each task duration is provided in minutes — respect it when placing blocks.
- Only schedule tasks from the provided task list (use exact taskId values).
- If there are no tasks, return an empty suggestions array with a brief summary.

Respond with ONLY valid JSON (no markdown fences) in this shape:
{
  "suggestions": [
    { "taskId": "<id>", "scheduledAt": "<ISO 8601 datetime>", "reason": "<brief reason>" }
  ],
  "summary": "<optional one-line overview>"
}`

export function buildOptimizeUserMessage(events: CalendarEvent[], tasks: OptimizeTaskInput[]): string {
  const eventPayload = events.map((e) => ({
    title: e.title,
    start: e.start,
    end: e.end,
  }))
  const taskPayload = tasks.map((t) => ({
    id: t.id,
    title: t.title,
    duration: t.duration,
    priority: t.priority,
  }))
  const today = new Date().toISOString().slice(0, 10)
  return `Today's date: ${today}

Calendar events:
${JSON.stringify(eventPayload, null, 2)}

Tasks to schedule:
${JSON.stringify(taskPayload, null, 2)}`
}

export function parseOptimizeResponse(text: string): OptimizeResponse {
  const trimmed = text.trim()
  const jsonText = trimmed.startsWith("{")
    ? trimmed
    : trimmed.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim()

  const parsed = JSON.parse(jsonText) as OptimizeResponse
  if (!Array.isArray(parsed.suggestions)) {
    throw new Error("Invalid optimization response: missing suggestions array")
  }

  return {
    suggestions: parsed.suggestions.map((s) => ({
      taskId: String(s.taskId),
      scheduledAt: String(s.scheduledAt),
      reason: String(s.reason ?? ""),
    })),
    summary: parsed.summary ? String(parsed.summary) : undefined,
  }
}
