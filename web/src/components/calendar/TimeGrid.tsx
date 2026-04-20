import React from "react"

export const GRID_START_HOUR = 7
export const GRID_END_HOUR = 22   // 10 PM (exclusive upper bound)
export const HOUR_HEIGHT = 80     // px per hour

// Generate half-hour slots from 7:00 AM to 10:00 PM
function generateSlots() {
  const slots: { label: string; showLabel: boolean }[] = []
  for (let hour = GRID_START_HOUR; hour < GRID_END_HOUR; hour++) {
    const period = hour < 12 ? "AM" : "PM"
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    slots.push({ label: `${displayHour}:00 ${period}`, showLabel: true })
    slots.push({ label: `${displayHour}:30 ${period}`, showLabel: false })
  }
  return slots
}

const slots = generateSlots()

interface TimeGridProps {
  children?: React.ReactNode
}

export default function TimeGrid({ children }: TimeGridProps) {
  const totalHours = GRID_END_HOUR - GRID_START_HOUR
  const totalHeight = totalHours * HOUR_HEIGHT

  return (
    <div className="flex w-full select-none">
      {/* Time label column */}
      <div className="flex-shrink-0 w-16 pr-2">
        {slots.map((slot, i) => (
          <div
            key={i}
            style={{ height: `${HOUR_HEIGHT / 2}px` }}
            className="flex items-start justify-end"
          >
            {slot.showLabel && (
              <span className="text-xs text-slate-400 font-medium -translate-y-2">
                {slot.label}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Grid content area — events are absolutely positioned inside */}
      <div
        className="relative flex-1 border-l border-slate-200"
        style={{ height: `${totalHeight}px` }}
      >
        {/* Hour lines */}
        {Array.from({ length: totalHours }).map((_, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 border-t border-slate-200"
            style={{ top: `${i * HOUR_HEIGHT}px` }}
          />
        ))}
        {/* Half-hour lines */}
        {Array.from({ length: totalHours }).map((_, i) => (
          <div
            key={`half-${i}`}
            className="absolute left-0 right-0 border-t border-slate-100"
            style={{ top: `${i * HOUR_HEIGHT + HOUR_HEIGHT / 2}px` }}
          />
        ))}

        {/* Events rendered as children */}
        {children}
      </div>
    </div>
  )
}
