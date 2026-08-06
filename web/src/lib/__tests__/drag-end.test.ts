import { resolveDragEndAction } from "../drag-end"
import type { Task } from "@/store/planner"

const taskA: Task = { id: "a", title: "Task A", duration: 30, priority: "medium" }
const taskB: Task = { id: "b", title: "Task B", duration: 45, priority: "high" }

describe("resolveDragEndAction (drag-and-drop integration)", () => {
  it("schedules a task when dropped on a calendar slot", () => {
    const slotTime = "2026-04-20T10:00:00.000Z"
    expect(resolveDragEndAction("a", taskA, { slotTime })).toEqual({
      type: "schedule",
      task: taskA,
      slotTime,
    })
  })

  it("reorders tasks when dropped on another task in the list", () => {
    expect(resolveDragEndAction("a", taskA, { task: taskB })).toEqual({
      type: "reorder",
      activeId: "a",
      overId: "b",
    })
  })

  it("ignores drop on self", () => {
    expect(resolveDragEndAction("a", taskA, { task: taskA })).toEqual({ type: "none" })
  })

  it("ignores drop with no target", () => {
    expect(resolveDragEndAction("a", taskA, undefined)).toEqual({ type: "none" })
  })
})
