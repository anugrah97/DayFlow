import type { Task } from "@/store/planner"
import type { CalendarEvent } from "@/lib/google-calendar"
import { checkConflict } from "@/lib/conflict"
import { isWithinGridHours } from "@/lib/grid-position"

export interface ScheduleTaskResult {
  scheduled: boolean
  warning: string | null
}

export function tryScheduleTask(
  task: Task,
  slotTime: string,
  calendarEvents: CalendarEvent[],
  scheduledTasks: Task[]
): ScheduleTaskResult {
  if (!isWithinGridHours(slotTime, task.duration)) {
    return {
      scheduled: false,
      warning: "Tasks can only be scheduled between 7:00 AM and 10:00 PM.",
    }
  }

  const conflict = checkConflict(task, slotTime, calendarEvents, scheduledTasks, task.id)
  return {
    scheduled: true,
    warning: conflict,
  }
}
