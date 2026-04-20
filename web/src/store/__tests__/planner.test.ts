import { act, renderHook } from "@testing-library/react"
import { usePlannerStore } from "../planner"

// Reset store between tests
beforeEach(() => {
  usePlannerStore.setState({ tasks: [] })
})

const BASE_TASK = { title: "Test task", duration: 30, priority: "medium" as const }

describe("addTask", () => {
  it("adds a task with a generated id", () => {
    const { result } = renderHook(() => usePlannerStore())
    act(() => result.current.addTask(BASE_TASK))
    expect(result.current.tasks).toHaveLength(1)
    expect(result.current.tasks[0].id).toBeTruthy()
    expect(result.current.tasks[0].title).toBe("Test task")
  })

  it("produces unique ids across 5 rapid adds", () => {
    const { result } = renderHook(() => usePlannerStore())
    act(() => {
      for (let i = 0; i < 5; i++) result.current.addTask({ ...BASE_TASK, title: `Task ${i}` })
    })
    const ids = result.current.tasks.map((t) => t.id)
    expect(new Set(ids).size).toBe(5)
  })
})

describe("updateTask", () => {
  it("updates the correct task by id", () => {
    const { result } = renderHook(() => usePlannerStore())
    act(() => result.current.addTask(BASE_TASK))
    const id = result.current.tasks[0].id
    act(() => result.current.updateTask(id, { title: "Updated", duration: 60 }))
    expect(result.current.tasks[0].title).toBe("Updated")
    expect(result.current.tasks[0].duration).toBe(60)
  })

  it("leaves other tasks unchanged", () => {
    const { result } = renderHook(() => usePlannerStore())
    act(() => {
      result.current.addTask({ ...BASE_TASK, title: "Task A" })
      result.current.addTask({ ...BASE_TASK, title: "Task B" })
    })
    const idA = result.current.tasks[0].id
    act(() => result.current.updateTask(idA, { title: "Task A Updated" }))
    expect(result.current.tasks[1].title).toBe("Task B")
  })
})

describe("deleteTask", () => {
  it("removes the task from the list", () => {
    const { result } = renderHook(() => usePlannerStore())
    act(() => result.current.addTask(BASE_TASK))
    const id = result.current.tasks[0].id
    act(() => result.current.deleteTask(id))
    expect(result.current.tasks).toHaveLength(0)
  })

  it("leaves other tasks intact", () => {
    const { result } = renderHook(() => usePlannerStore())
    act(() => {
      result.current.addTask({ ...BASE_TASK, title: "Task A" })
      result.current.addTask({ ...BASE_TASK, title: "Task B" })
    })
    const idA = result.current.tasks[0].id
    act(() => result.current.deleteTask(idA))
    expect(result.current.tasks).toHaveLength(1)
    expect(result.current.tasks[0].title).toBe("Task B")
  })
})

describe("scheduleTask", () => {
  it("sets scheduledAt on the correct task", () => {
    const { result } = renderHook(() => usePlannerStore())
    act(() => result.current.addTask(BASE_TASK))
    const id = result.current.tasks[0].id
    const iso = "2026-04-20T09:00:00.000Z"
    act(() => result.current.scheduleTask(id, iso))
    expect(result.current.tasks[0].scheduledAt).toBe(iso)
  })
})

describe("unscheduleTask", () => {
  it("clears scheduledAt to undefined", () => {
    const { result } = renderHook(() => usePlannerStore())
    act(() => result.current.addTask(BASE_TASK))
    const id = result.current.tasks[0].id
    act(() => result.current.scheduleTask(id, "2026-04-20T09:00:00.000Z"))
    act(() => result.current.unscheduleTask(id))
    expect(result.current.tasks[0].scheduledAt).toBeUndefined()
  })
})

describe("reorderTasks", () => {
  it("moves a task to the correct index", () => {
    const { result } = renderHook(() => usePlannerStore())
    act(() => {
      result.current.addTask({ ...BASE_TASK, title: "A" })
      result.current.addTask({ ...BASE_TASK, title: "B" })
      result.current.addTask({ ...BASE_TASK, title: "C" })
    })
    const [idA, , idC] = result.current.tasks.map((t) => t.id)
    act(() => result.current.reorderTasks(idC, idA))
    expect(result.current.tasks[0].title).toBe("C")
    expect(result.current.tasks[1].title).toBe("A")
  })
})
