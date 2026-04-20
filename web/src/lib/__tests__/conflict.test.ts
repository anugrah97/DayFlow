import { checkConflict } from "../conflict"
import { Task } from "@/store/planner"
import { CalendarEvent } from "@/lib/google-calendar"

const task: Task = { id: "t1", title: "Write report", duration: 30, priority: "medium" }

const makeEvent = (startIso: string, endIso: string, title = "Meeting"): CalendarEvent => ({
  id: "e1",
  title,
  start: startIso,
  end: endIso,
  attendeeCount: 0,
})

describe("checkConflict", () => {
  it("returns null when events array is empty", () => {
    expect(checkConflict(task, "2026-04-20T09:00:00.000Z", [])).toBeNull()
  })

  it("returns null when task slot is completely free", () => {
    // task: 14:00–14:30, event: 10:00–11:00
    const event = makeEvent("2026-04-20T10:00:00.000Z", "2026-04-20T11:00:00.000Z")
    expect(checkConflict(task, "2026-04-20T14:00:00.000Z", [event])).toBeNull()
  })

  it("detects exact overlap (task starts inside event)", () => {
    // event: 10:00–11:00, task: 10:00–10:30
    const event = makeEvent("2026-04-20T10:00:00.000Z", "2026-04-20T11:00:00.000Z", "Standup")
    const result = checkConflict(task, "2026-04-20T10:00:00.000Z", [event])
    expect(result).not.toBeNull()
    expect(result).toContain("Standup")
  })

  it("detects partial overlap (task extends into event)", () => {
    // event: 10:00–11:00, task (30m): 10:45–11:15 — partial overlap
    const event = makeEvent("2026-04-20T10:00:00.000Z", "2026-04-20T11:00:00.000Z")
    expect(checkConflict(task, "2026-04-20T10:45:00.000Z", [event])).not.toBeNull()
  })

  it("returns null when task starts exactly at event end (boundary — no overlap)", () => {
    // event ends 10:30, task starts 10:30 — should NOT conflict
    const event = makeEvent("2026-04-20T10:00:00.000Z", "2026-04-20T10:30:00.000Z")
    expect(checkConflict(task, "2026-04-20T10:30:00.000Z", [event])).toBeNull()
  })

  it("returns null when task ends exactly at event start (boundary — no overlap)", () => {
    // task (30m) ends at 10:00, event starts 10:00 — should NOT conflict
    const event = makeEvent("2026-04-20T10:00:00.000Z", "2026-04-20T11:00:00.000Z")
    expect(checkConflict(task, "2026-04-20T09:30:00.000Z", [event])).toBeNull()
  })

  it("includes the conflicting event name in the returned message", () => {
    const event = makeEvent("2026-04-20T09:00:00.000Z", "2026-04-20T10:00:00.000Z", "Design Review")
    const result = checkConflict(task, "2026-04-20T09:00:00.000Z", [event])
    expect(result).toContain("Design Review")
  })
})
