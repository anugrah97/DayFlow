import { Task } from "@/store/planner"
import { CalendarEvent } from "@/lib/google-calendar"

export function checkConflict(task: Task, slotTime: string, events: CalendarEvent[]): string | null {
  const taskStart = new Date(slotTime)
  const taskEnd = new Date(taskStart.getTime() + task.duration * 60 * 1000)
  for (const event of events) {
    const evStart = new Date(event.start)
    const evEnd = new Date(event.end)
    if (taskStart < evEnd && taskEnd > evStart) {
      return `Conflicts with "${event.title}" at ${evStart.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    }
  }
  return null
}
