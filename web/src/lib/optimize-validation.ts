import { isWithinGridHours } from "@/lib/grid-position"
import type { OptimizeResponse, ScheduleSuggestion } from "@/lib/optimization"
import {
  TASK_MAX_DURATION,
  TASK_MIN_DURATION,
  TASK_PRIORITIES,
  TASK_TITLE_MAX_LENGTH,
  type OptimizeTaskInput,
} from "@/lib/task-constraints"

export const OPTIMIZE_MAX_BODY_BYTES = 32_768
export const OPTIMIZE_MAX_TASKS = 50

export type ValidateTasksResult =
  | { ok: true; tasks: OptimizeTaskInput[] }
  | { ok: false; error: string }

export function validateOptimizeTasks(tasks: unknown): ValidateTasksResult {
  if (!Array.isArray(tasks)) {
    return { ok: false, error: "tasks array is required" }
  }

  if (tasks.length === 0) {
    return { ok: false, error: "No tasks to optimize" }
  }

  if (tasks.length > OPTIMIZE_MAX_TASKS) {
    return { ok: false, error: "Too many tasks in request" }
  }

  const validated: OptimizeTaskInput[] = []

  for (let i = 0; i < tasks.length; i++) {
    const item = tasks[i]
    if (!item || typeof item !== "object") {
      return { ok: false, error: `Invalid task at index ${i}` }
    }

    const { id, title, duration, priority } = item as Record<string, unknown>

    if (typeof id !== "string" || !id.trim()) {
      return { ok: false, error: `Invalid task id at index ${i}` }
    }

    if (typeof title !== "string" || !title.trim()) {
      return { ok: false, error: `Task title is required at index ${i}` }
    }

    if (title.trim().length > TASK_TITLE_MAX_LENGTH) {
      return { ok: false, error: `Task title exceeds ${TASK_TITLE_MAX_LENGTH} characters at index ${i}` }
    }

    if (typeof duration !== "number" || !Number.isInteger(duration)) {
      return { ok: false, error: `Task duration must be an integer at index ${i}` }
    }

    if (duration < TASK_MIN_DURATION || duration > TASK_MAX_DURATION) {
      return {
        ok: false,
        error: `Task duration must be between ${TASK_MIN_DURATION} and ${TASK_MAX_DURATION} minutes at index ${i}`,
      }
    }

    if (typeof priority !== "string" || !(TASK_PRIORITIES as ReadonlySet<string>).has(priority)) {
      return { ok: false, error: `Task priority must be high, medium, or low at index ${i}` }
    }

    validated.push({
      id: id.trim(),
      title: title.trim(),
      duration,
      priority: priority as OptimizeTaskInput["priority"],
    })
  }

  return { ok: true, tasks: validated }
}

export function sanitizeOptimizeResponse(
  response: OptimizeResponse,
  submittedTasks: OptimizeTaskInput[]
): OptimizeResponse {
  const taskById = new Map(submittedTasks.map((t) => [t.id, t]))
  const allowedIds = new Set(submittedTasks.map((t) => t.id))
  const seenIds = new Set<string>()

  const suggestions: ScheduleSuggestion[] = []

  for (const suggestion of response.suggestions) {
    if (!allowedIds.has(suggestion.taskId) || seenIds.has(suggestion.taskId)) {
      continue
    }

    const task = taskById.get(suggestion.taskId)
    if (!task) continue

    const scheduledAt = suggestion.scheduledAt
    if (!scheduledAt || Number.isNaN(Date.parse(scheduledAt))) {
      continue
    }

    if (!isWithinGridHours(scheduledAt, task.duration)) {
      continue
    }

    seenIds.add(suggestion.taskId)
    suggestions.push({
      taskId: suggestion.taskId,
      scheduledAt,
      reason: suggestion.reason.slice(0, 500),
    })
  }

  return {
    suggestions,
    summary: response.summary?.slice(0, 500),
  }
}
