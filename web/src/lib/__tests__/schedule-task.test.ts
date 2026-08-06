import { tryScheduleTask } from "../schedule-task"
import type { Task } from "@/store/planner"

const task: Task = {
  id: "task-1",
  title: "Deep work",
  duration: 30,
  priority: "high",
}

function slotAt(hour: number, minute = 0): string {
  const d = new Date()
  d.setHours(hour, minute, 0, 0)
  return d.toISOString()
}

describe("tryScheduleTask", () => {
  it("schedules a task in a free slot", () => {
    const result = tryScheduleTask(task, slotAt(10), [], [])
    expect(result.scheduled).toBe(true)
    expect(result.warning).toBeNull()
  })

  it("blocks scheduling outside grid hours", () => {
    const result = tryScheduleTask(task, slotAt(23), [], [])
    expect(result.scheduled).toBe(false)
    expect(result.warning).toMatch(/7:00 AM/)
  })

  it("warns when overlapping a calendar event but still schedules", () => {
    const result = tryScheduleTask(
      task,
      slotAt(10),
      [{
        id: "e1",
        title: "Standup",
        start: slotAt(10),
        end: slotAt(10, 30),
        attendeeCount: 0,
      }],
      []
    )
    expect(result.scheduled).toBe(true)
    expect(result.warning).toContain("Standup")
  })

  it("warns when overlapping another scheduled task", () => {
    const other: Task = {
      id: "task-2",
      title: "Email",
      duration: 30,
      priority: "low",
      scheduledAt: slotAt(14),
    }
    const result = tryScheduleTask(task, slotAt(14, 15), [], [other])
    expect(result.scheduled).toBe(true)
    expect(result.warning).toContain("Email")
  })
})
