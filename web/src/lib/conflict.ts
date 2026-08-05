import { Task } from "@/store/planner"
import { CalendarEvent } from "@/lib/google-calendar"

function rangesOverlap(
  aStart: Date,
  aEnd: Date,
  bStart: Date,
  bEnd: Date
): boolean {
  return aStart < bEnd && aEnd > bStart
}

export function checkConflict(
  task: Task,
  slotTime: string,
  events: CalendarEvent[],
  scheduledTasks: Task[] = [],
  excludeTaskId?: string
): string | null {
  const taskStart = new Date(slotTime)
  const taskEnd = new Date(taskStart.getTime() + task.duration * 60 * 1000)

  for (const event of events) {
    if (event.allDay) continue
    const evStart = new Date(event.start)
    const evEnd = new Date(event.end)
    if (rangesOverlap(taskStart, taskEnd, evStart, evEnd)) {
      return `Conflicts with "${event.title}" at ${evStart.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    }
  }

  for (const other of scheduledTasks) {
    if (!other.scheduledAt) continue
    if (other.id === excludeTaskId || other.id === task.id) continue
    const otherStart = new Date(other.scheduledAt)
    const otherEnd = new Date(otherStart.getTime() + other.duration * 60 * 1000)
    if (rangesOverlap(taskStart, taskEnd, otherStart, otherEnd)) {
      return `Conflicts with task "${other.title}" at ${otherStart.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    }
  }

  return null
}
