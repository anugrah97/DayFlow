import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Priority = "high" | "medium" | "low"

export const TASK_TITLE_MAX_LENGTH = 200
export const PLANNER_STORAGE_PREFIX = "dayflow-planner"

export function getPlannerStorageKey(userId: string): string {
  return `${PLANNER_STORAGE_PREFIX}-${userId}`
}

export function clearAllPlannerStorage(): void {
  if (typeof window === "undefined") return
  for (const key of Object.keys(localStorage)) {
    if (key.startsWith(PLANNER_STORAGE_PREFIX)) {
      localStorage.removeItem(key)
    }
  }
}

function normalizeTitle(title: string): string {
  return title.trim().slice(0, TASK_TITLE_MAX_LENGTH)
}

export interface Task {
  id: string
  title: string
  duration: number        // minutes
  priority: Priority
  scheduledAt?: string    // ISO string, set when dropped on calendar
}

interface PlannerStore {
  tasks: Task[]
  addTask: (task: Omit<Task, "id">) => void
  updateTask: (id: string, updates: Partial<Omit<Task, "id">>) => void
  deleteTask: (id: string) => void
  scheduleTask: (id: string, scheduledAt: string) => void
  unscheduleTask: (id: string) => void
  reorderTasks: (activeId: string, overId: string) => void
}

export const usePlannerStore = create<PlannerStore>()(
  persist(
    (set) => ({
      tasks: [],
      addTask: (task) => set((s) => ({
        tasks: [...s.tasks, { ...task, id: crypto.randomUUID(), title: normalizeTitle(task.title) }]
      })),
      updateTask: (id, updates) => set((s) => ({
        tasks: s.tasks.map((t) => t.id === id
          ? { ...t, ...updates, ...(updates.title !== undefined ? { title: normalizeTitle(updates.title) } : {}) }
          : t)
      })),
      deleteTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
      scheduleTask: (id, scheduledAt) => set((s) => ({
        tasks: s.tasks.map((t) => t.id === id ? { ...t, scheduledAt } : t)
      })),
      unscheduleTask: (id) => set((s) => ({
        tasks: s.tasks.map((t) => t.id === id ? { ...t, scheduledAt: undefined } : t)
      })),
      reorderTasks: (activeId, overId) => set((s) => {
        const items = [...s.tasks]
        const from = items.findIndex((t) => t.id === activeId)
        const to = items.findIndex((t) => t.id === overId)
        if (from === -1 || to === -1) return s
        const [moved] = items.splice(from, 1)
        items.splice(to, 0, moved)
        return { tasks: items }
      }),
    }),
    { name: PLANNER_STORAGE_PREFIX }
  )
)
