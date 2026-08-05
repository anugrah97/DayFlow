"use client"

import { Task } from "@/store/planner"
import { GRID_START_HOUR, HOUR_HEIGHT } from "./TimeGrid"

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const hrs = minutes / 60
  return hrs % 1 === 0 ? `${hrs}hr` : `${hrs}hr`
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
}

interface SuggestedTaskBlockProps {
  task: Task
  scheduledAt: string
  reason: string
}

export default function SuggestedTaskBlock({ task, scheduledAt, reason }: SuggestedTaskBlockProps) {
  const startDate = new Date(scheduledAt)
  const startHour = startDate.getHours()
  const startMin = startDate.getMinutes()

  const startMinutes = (startHour - GRID_START_HOUR) * 60 + startMin
  const topPx = (startMinutes / 60) * HOUR_HEIGHT
  const heightPx = Math.max((task.duration / 60) * HOUR_HEIGHT, 28)

  return (
    <div
      className="absolute left-1 right-1 rounded-md border-2 border-dashed border-blue-400 bg-blue-50/80 px-2 py-1 overflow-hidden pointer-events-none z-10"
      style={{ top: `${topPx}px`, height: `${heightPx}px` }}
      title={`${task.title} — ${reason}`}
    >
      <p className="font-medium text-xs text-blue-900 truncate leading-tight">
        {task.title}
      </p>
      {heightPx >= 36 && (
        <p className="text-[10px] text-blue-700 truncate mt-0.5">
          {formatTime(scheduledAt)} · {formatDuration(task.duration)}
        </p>
      )}
      {heightPx >= 52 && (
        <p className="text-[10px] text-blue-600 truncate mt-0.5 italic">{reason}</p>
      )}
    </div>
  )
}
