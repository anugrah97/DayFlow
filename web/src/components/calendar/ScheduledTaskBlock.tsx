"use client"

import { Task } from "@/store/planner"
import { usePlannerStore } from "@/store/planner"
import { GRID_START_HOUR, HOUR_HEIGHT } from "./TimeGrid"

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const hrs = minutes / 60
  return hrs % 1 === 0 ? `${hrs}hr` : `${hrs}hr`
}

interface ScheduledTaskBlockProps {
  task: Task
}

export default function ScheduledTaskBlock({ task }: ScheduledTaskBlockProps) {
  const unscheduleTask = usePlannerStore((s) => s.unscheduleTask)

  if (!task.scheduledAt) return null

  const startDate = new Date(task.scheduledAt)
  const startHour = startDate.getHours()
  const startMin = startDate.getMinutes()

  const startMinutes = (startHour - GRID_START_HOUR) * 60 + startMin
  const topPx = (startMinutes / 60) * HOUR_HEIGHT
  const heightPx = Math.max((task.duration / 60) * HOUR_HEIGHT, 24)

  return (
    <div
      className="absolute left-1 right-1 rounded-md border border-dashed border-violet-400 bg-violet-50 px-2 py-1 overflow-hidden cursor-default group"
      style={{ top: `${topPx}px`, height: `${heightPx}px` }}
      title={`${task.title} (${formatDuration(task.duration)})`}
    >
      <div className="flex items-start justify-between gap-1 h-full">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-xs text-violet-900 truncate leading-tight">{task.title}</p>
          {heightPx >= 40 && (
            <p className="text-xs text-violet-600 opacity-75 mt-0.5">{formatDuration(task.duration)}</p>
          )}
        </div>
        <button
          onClick={() => unscheduleTask(task.id)}
          className="flex-shrink-0 w-4 h-4 rounded-full bg-violet-200 text-violet-600 hover:bg-violet-300 hover:text-violet-800 transition-colors opacity-0 group-hover:opacity-100 flex items-center justify-center leading-none"
          aria-label="Unschedule task"
        >
          <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="2" y1="2" x2="8" y2="8" />
            <line x1="8" y1="2" x2="2" y2="8" />
          </svg>
        </button>
      </div>
    </div>
  )
}
