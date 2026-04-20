"use client"

import { useState } from "react"
import { useDraggable } from "@dnd-kit/core"
import { usePlannerStore, Task, Priority } from "@/store/planner"

const DURATION_OPTIONS = [
  { label: "15 min", value: 15 },
  { label: "30 min", value: 30 },
  { label: "45 min", value: 45 },
  { label: "1 hr", value: 60 },
  { label: "1.5 hr", value: 90 },
  { label: "2 hr", value: 120 },
  { label: "3 hr", value: 180 },
]

const PRIORITY_OPTIONS: { label: string; value: Priority }[] = [
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
]

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const hrs = minutes / 60
  return hrs % 1 === 0 ? `${hrs}hr` : `${hrs}hr`
}

const PRIORITY_BORDER: Record<Priority, string> = {
  high: "border-l-red-500",
  medium: "border-l-yellow-400",
  low: "border-l-green-500",
}

const PRIORITY_BADGE: Record<Priority, string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-green-100 text-green-700",
}

interface TaskItemProps {
  task: Task
}

export default function TaskItem({ task }: TaskItemProps) {
  const { updateTask, deleteTask } = usePlannerStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [editDuration, setEditDuration] = useState(task.duration)
  const [editPriority, setEditPriority] = useState<Priority>(task.priority)
  const [titleError, setTitleError] = useState(false)

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { type: "task", task },
  })

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined

  function handleDelete() {
    if (window.confirm("Delete this task?")) {
      deleteTask(task.id)
    }
  }

  function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!editTitle.trim()) {
      setTitleError(true)
      return
    }
    updateTask(task.id, {
      title: editTitle.trim(),
      duration: editDuration,
      priority: editPriority,
    })
    setIsEditing(false)
    setTitleError(false)
  }

  function handleEditCancel() {
    setEditTitle(task.title)
    setEditDuration(task.duration)
    setEditPriority(task.priority)
    setIsEditing(false)
    setTitleError(false)
  }

  if (isEditing) {
    return (
      <div className={`rounded-md border border-slate-200 border-l-4 ${PRIORITY_BORDER[task.priority]} p-3 bg-white`}>
        <form onSubmit={handleEditSubmit} className="space-y-2">
          <div>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => {
                setEditTitle(e.target.value)
                if (titleError && e.target.value.trim()) setTitleError(false)
              }}
              className={`w-full rounded border px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
                titleError ? "border-red-400" : "border-slate-200"
              }`}
            />
            {titleError && <p className="text-xs text-red-500 mt-1">Title is required</p>}
          </div>
          <div className="flex gap-2">
            <select
              value={editDuration}
              onChange={(e) => setEditDuration(Number(e.target.value))}
              className="flex-1 rounded border border-slate-200 px-2 py-1.5 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500"
            >
              {DURATION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value as Priority)}
              className="flex-1 rounded border border-slate-200 px-2 py-1.5 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500"
            >
              {PRIORITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 rounded bg-blue-600 px-2 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleEditCancel}
              className="flex-1 rounded border border-slate-200 px-2 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-md border border-slate-200 border-l-4 ${PRIORITY_BORDER[task.priority]} p-3 bg-white select-none ${
        isDragging ? "opacity-50 shadow-lg z-50" : ""
      }`}
    >
      <div className="flex items-start gap-2">
        {/* Drag handle */}
        <button
          {...listeners}
          {...attributes}
          className="mt-0.5 flex-shrink-0 cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 transition-colors"
          aria-label="Drag to schedule"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <circle cx="4" cy="3" r="1.2" />
            <circle cx="10" cy="3" r="1.2" />
            <circle cx="4" cy="7" r="1.2" />
            <circle cx="10" cy="7" r="1.2" />
            <circle cx="4" cy="11" r="1.2" />
            <circle cx="10" cy="11" r="1.2" />
          </svg>
        </button>

        {/* Task content */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-slate-800 truncate">{task.title}</p>
          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 font-medium">
              {formatDuration(task.duration)}
            </span>
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${PRIORITY_BADGE[task.priority]}`}>
              {task.priority}
            </span>
            {task.scheduledAt && (
              <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                Scheduled
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-1 flex-shrink-0">
          <button
            onClick={() => setIsEditing(true)}
            className="rounded p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Edit task"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="rounded p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            aria-label="Delete task"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
