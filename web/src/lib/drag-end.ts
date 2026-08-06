import type { Task } from "@/store/planner"

export type DragEndAction =
  | { type: "schedule"; task: Task; slotTime: string }
  | { type: "reorder"; activeId: string; overId: string }
  | { type: "none" }

export function resolveDragEndAction(
  activeId: string,
  activeTask: Task | undefined,
  overData: { slotTime?: string; task?: Task } | undefined
): DragEndAction {
  if (!overData) return { type: "none" }

  const slotTime = overData.slotTime
  if (activeTask && slotTime) {
    return { type: "schedule", task: activeTask, slotTime }
  }

  const overTask = overData.task
  if (activeTask && overTask && activeId !== overTask.id) {
    return { type: "reorder", activeId, overId: overTask.id }
  }

  return { type: "none" }
}
