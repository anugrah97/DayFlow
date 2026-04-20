"use client"

import { useState } from "react"
import { usePlannerStore, Priority } from "@/store/planner"

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

export default function AddTaskForm() {
  const [title, setTitle] = useState("")
  const [duration, setDuration] = useState(30)
  const [priority, setPriority] = useState<Priority>("medium")
  const [titleError, setTitleError] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) {
      setTitleError(true)
      return
    }
    usePlannerStore.getState().addTask({ title: title.trim(), duration, priority })
    setTitle("")
    setDuration(30)
    setPriority("medium")
    setTitleError(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mb-4">
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            if (titleError && e.target.value.trim()) setTitleError(false)
          }}
          placeholder="Task title"
          className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition ${
            titleError ? "border-red-400 focus:ring-red-400" : "border-slate-200"
          }`}
        />
        {titleError && (
          <p className="text-xs text-red-500 mt-1">Title is required</p>
        )}
      </div>

      <div className="flex gap-2">
        <select
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="flex-1 rounded-md border border-slate-200 px-2 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          {DURATION_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className="flex-1 rounded-md border border-slate-200 px-2 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          {PRIORITY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
      >
        Add Task
      </button>
    </form>
  )
}
