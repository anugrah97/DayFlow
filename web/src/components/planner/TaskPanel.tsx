"use client"

import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { usePlannerStore } from "@/store/planner"
import type { ScheduleSuggestion } from "@/lib/optimization"
import type { CalendarEvent } from "@/lib/google-calendar"
import AddTaskForm from "./AddTaskForm"
import OptimizationPanel from "./OptimizationPanel"
import TaskItem from "./TaskItem"

interface TaskPanelProps {
  suggestions: ScheduleSuggestion[]
  onSuggestionsChange: (suggestions: ScheduleSuggestion[]) => void
  calendarEvents: CalendarEvent[]
  onConflictWarning: (message: string) => void
}

export default function TaskPanel({
  suggestions,
  onSuggestionsChange,
  calendarEvents,
  onConflictWarning,
}: TaskPanelProps) {
  const tasks = usePlannerStore((s) => s.tasks)

  const unscheduled = tasks.filter((t) => !t.scheduledAt)
  const scheduled = tasks.filter((t) => t.scheduledAt)

  return (
    <div className="flex-shrink-0 w-80 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-lg font-semibold text-slate-800">My Tasks</h2>
        {tasks.length > 0 && (
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
            {tasks.length}
          </span>
        )}
      </div>

      <OptimizationPanel
        suggestions={suggestions}
        onSuggestionsChange={onSuggestionsChange}
        calendarEvents={calendarEvents}
        onConflictWarning={onConflictWarning}
      />

      {/* Add Task Form */}
      <AddTaskForm />

      {/* Divider */}
      <div className="border-t border-slate-100 mb-3" />

      {/* Task List */}
      <div className="flex-1 overflow-y-auto pr-1">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-sm text-slate-500 font-medium">No tasks yet — add one above</p>
          </div>
        ) : (
          <>
            {unscheduled.length > 0 && (
              <SortableContext items={unscheduled.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2 mb-3">
                  {unscheduled.map((task) => (
                    <TaskItem key={task.id} task={task} />
                  ))}
                </div>
              </SortableContext>
            )}
            {scheduled.length > 0 && (
              <div className="space-y-2">
                {scheduled.map((task) => (
                  <TaskItem key={task.id} task={task} sortable={false} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
