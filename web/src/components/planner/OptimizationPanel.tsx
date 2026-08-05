"use client"

import { useState } from "react"
import { Sparkles, Loader2 } from "lucide-react"
import { usePlannerStore, Task } from "@/store/planner"
import type { ScheduleSuggestion } from "@/lib/optimization"

interface OptimizationPanelProps {
  suggestions: ScheduleSuggestion[]
  onSuggestionsChange: (suggestions: ScheduleSuggestion[]) => void
}

function formatSuggestionTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
}

export default function OptimizationPanel({
  suggestions,
  onSuggestionsChange,
}: OptimizationPanelProps) {
  const tasks = usePlannerStore((s) => s.tasks)
  const scheduleTask = usePlannerStore((s) => s.scheduleTask)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [summary, setSummary] = useState<string | null>(null)

  const unscheduledTasks = tasks.filter((t) => !t.scheduledAt)
  const canOptimize = unscheduledTasks.length > 0 && !isLoading

  async function handleOptimize() {
    if (!canOptimize) return

    setIsLoading(true)
    setError(null)
    setSummary(null)
    onSuggestionsChange([])

    try {
      const res = await fetch("/api/ai/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tasks: unscheduledTasks.map(({ id, title, duration, priority }) => ({
            id,
            title,
            duration,
            priority,
          })),
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.error ?? "Failed to optimize schedule")
      }

      onSuggestionsChange(data.suggestions ?? [])
      setSummary(data.summary ?? null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  function getTask(taskId: string): Task | undefined {
    return tasks.find((t) => t.id === taskId)
  }

  function handleAccept(suggestion: ScheduleSuggestion) {
    scheduleTask(suggestion.taskId, suggestion.scheduledAt)
    onSuggestionsChange(suggestions.filter((s) => s.taskId !== suggestion.taskId))
  }

  function handleDismiss(taskId: string) {
    onSuggestionsChange(suggestions.filter((s) => s.taskId !== taskId))
  }

  function handleAcceptAll() {
    for (const suggestion of suggestions) {
      scheduleTask(suggestion.taskId, suggestion.scheduledAt)
    }
    onSuggestionsChange([])
    setSummary(null)
  }

  function handleDismissAll() {
    onSuggestionsChange([])
    setSummary(null)
  }

  return (
    <div className="mb-4 space-y-3">
      <button
        type="button"
        onClick={handleOptimize}
        disabled={!canOptimize}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:from-blue-700 hover:to-violet-700 hover:shadow-lg disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed disabled:shadow-none"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Optimizing…
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Optimize My Day
          </>
        )}
      </button>

      {unscheduledTasks.length === 0 && tasks.length > 0 && (
        <p className="text-xs text-slate-500 text-center">All tasks are scheduled</p>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </div>
      )}

      {summary && suggestions.length > 0 && (
        <p className="text-xs text-slate-600 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
          {summary}
        </p>
      )}

      {suggestions.length > 0 && (
        <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold text-blue-900 uppercase tracking-wide">
              AI Suggestions
            </p>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={handleAcceptAll}
                className="text-xs font-medium text-blue-700 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
              >
                Accept All
              </button>
              <button
                type="button"
                onClick={handleDismissAll}
                className="text-xs font-medium text-slate-500 hover:text-slate-700 px-2 py-1 rounded hover:bg-slate-100 transition-colors"
              >
                Dismiss All
              </button>
            </div>
          </div>

          <ul className="space-y-2">
            {suggestions.map((suggestion) => {
              const task = getTask(suggestion.taskId)
              if (!task) return null
              return (
                <li
                  key={suggestion.taskId}
                  className="rounded-lg border border-blue-100 bg-white p-2.5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-800 truncate">
                        {task.title}
                      </p>
                      <p className="text-xs text-blue-700 mt-0.5">
                        {formatSuggestionTime(suggestion.scheduledAt)}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 italic line-clamp-2">
                        {suggestion.reason}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleAccept(suggestion)}
                        className="rounded-md bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDismiss(suggestion.taskId)}
                        className="rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
