"use client"

import { useState, useCallback, useEffect } from "react"
import { DndContext, DragEndEvent, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import DayView from "@/components/calendar/DayView"
import { CalendarEvent } from "@/components/calendar/DayView"
import DroppableSlot from "@/components/calendar/DroppableSlot"
import ScheduledTaskBlock from "@/components/calendar/ScheduledTaskBlock"
import TaskPanel from "@/components/planner/TaskPanel"
import { usePlannerStore, Task } from "@/store/planner"
import { useShallow } from "zustand/react/shallow"
import { GRID_START_HOUR, GRID_END_HOUR, HOUR_HEIGHT } from "@/components/calendar/TimeGrid"
import { checkConflict } from "@/lib/conflict"

// ---------------------------------------------------------------------------
// Build ISO slot time for today
// ---------------------------------------------------------------------------
function buildSlotTime(hour: number, minute: number): string {
  const d = new Date()
  d.setHours(hour, minute, 0, 0)
  return d.toISOString()
}

// ---------------------------------------------------------------------------
// Droppable slots overlay (rendered inside TimeGrid as extraChildren)
// ---------------------------------------------------------------------------
function DroppableSlots() {
  const slots: React.ReactNode[] = []
  for (let hour = GRID_START_HOUR; hour < GRID_END_HOUR; hour++) {
    for (const minute of [0, 30]) {
      const slotTime = buildSlotTime(hour, minute)
      const topPx = ((hour - GRID_START_HOUR) * 60 + minute) / 60 * HOUR_HEIGHT
      slots.push(
        <DroppableSlot
          key={slotTime}
          slotTime={slotTime}
          style={{ top: `${topPx}px`, height: `${HOUR_HEIGHT / 2}px` }}
        />
      )
    }
  }
  return <>{slots}</>
}

// ---------------------------------------------------------------------------
// Conflict toast
// ---------------------------------------------------------------------------
interface ConflictToastProps {
  message: string
  onDismiss: () => void
}

function ConflictToast({ message, onDismiss }: ConflictToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 shadow-lg max-w-sm">
      <svg
        className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-amber-800">Scheduling Conflict</p>
        <p className="text-sm text-amber-700 mt-0.5">{message}</p>
      </div>
      <button
        onClick={onDismiss}
        className="flex-shrink-0 text-amber-500 hover:text-amber-700 transition-colors"
        aria-label="Dismiss warning"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="4" y1="4" x2="12" y2="12" />
          <line x1="12" y1="4" x2="4" y2="12" />
        </svg>
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function CalendarPage() {
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([])
  const [conflictWarning, setConflictWarning] = useState<string | null>(null)
  const [activeDragTask, setActiveDragTask] = useState<Task | null>(null)

  const scheduledTasks = usePlannerStore(useShallow((s) => s.tasks.filter((t) => !!t.scheduledAt)))

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const handleEventsLoaded = useCallback((events: CalendarEvent[]) => {
    setCalendarEvents(events)
  }, [])

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveDragTask(null)
    if (!over) return

    const task = active.data.current?.task as Task | undefined
    const slotTime = over.data.current?.slotTime as string | undefined

    if (!task || !slotTime) return

    const conflict = checkConflict(task, slotTime, calendarEvents)
    if (conflict) {
      setConflictWarning(conflict)
    }
    usePlannerStore.getState().scheduleTask(task.id, slotTime)
  }

  function handleDragStart(event: { active: { data: { current?: { task?: Task } } } }) {
    const task = event.active.data.current?.task
    if (task) setActiveDragTask(task)
  }

  const extraChildren = (
    <>
      <DroppableSlots />
      {scheduledTasks.map((task) => (
        <ScheduledTaskBlock key={task.id} task={task} />
      ))}
    </>
  )

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-6 p-6 h-full">
        <TaskPanel />
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-semibold mb-4">Today</h1>
          <DayView onEventsLoaded={handleEventsLoaded} extraChildren={extraChildren} />
        </div>
      </div>

      {/* Drag overlay — shows a ghost of the task while dragging */}
      <DragOverlay>
        {activeDragTask && (
          <div className="rounded-md border border-slate-300 bg-white shadow-xl px-3 py-2 text-sm font-medium text-slate-700 opacity-90 pointer-events-none w-48">
            {activeDragTask.title}
          </div>
        )}
      </DragOverlay>

      {conflictWarning && (
        <ConflictToast
          message={conflictWarning}
          onDismiss={() => setConflictWarning(null)}
        />
      )}
    </DndContext>
  )
}
