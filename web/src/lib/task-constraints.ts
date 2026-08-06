import type { Priority } from "@/store/planner"

export const TASK_TITLE_MAX_LENGTH = 200
export const TASK_MIN_DURATION = 15
export const TASK_MAX_DURATION = 180
export const TASK_PRIORITIES = new Set<Priority>(["high", "medium", "low"])

export interface OptimizeTaskInput {
  id: string
  title: string
  duration: number
  priority: Priority
}
