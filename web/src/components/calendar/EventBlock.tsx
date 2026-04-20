import { CalendarEvent } from "@/lib/google-calendar"
import { GRID_START_HOUR, HOUR_HEIGHT } from "./TimeGrid"

// Color palette for events (cycles by index, or maps colorId)
const COLOR_PALETTE = [
  { bg: "bg-blue-100", border: "border-blue-400", text: "text-blue-900", dot: "bg-blue-500" },
  { bg: "bg-violet-100", border: "border-violet-400", text: "text-violet-900", dot: "bg-violet-500" },
  { bg: "bg-emerald-100", border: "border-emerald-400", text: "text-emerald-900", dot: "bg-emerald-500" },
  { bg: "bg-amber-100", border: "border-amber-400", text: "text-amber-900", dot: "bg-amber-500" },
  { bg: "bg-rose-100", border: "border-rose-400", text: "text-rose-900", dot: "bg-rose-500" },
  { bg: "bg-cyan-100", border: "border-cyan-400", text: "text-cyan-900", dot: "bg-cyan-500" },
  { bg: "bg-pink-100", border: "border-pink-400", text: "text-pink-900", dot: "bg-pink-500" },
  { bg: "bg-indigo-100", border: "border-indigo-400", text: "text-indigo-900", dot: "bg-indigo-500" },
]

// Map Google Calendar colorId (1–11) to palette entries
const COLOR_ID_MAP: Record<string, number> = {
  "1": 0,  // Lavender → blue
  "2": 2,  // Sage → emerald
  "3": 2,  // Grape → emerald
  "4": 4,  // Flamingo → rose
  "5": 3,  // Banana → amber
  "6": 5,  // Tangerine → cyan
  "7": 2,  // Peacock → emerald
  "8": 0,  // Blueberry → blue
  "9": 2,  // Basil → emerald
  "10": 4, // Tomato → rose
  "11": 3, // Graphite → amber
}

function formatTimeRange(start: string, end: string): string {
  const s = new Date(start)
  const e = new Date(end)

  const fmt = (d: Date) => {
    const h = d.getHours()
    const m = d.getMinutes()
    const period = h < 12 ? "AM" : "PM"
    const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h
    return m === 0 ? `${displayH} ${period}` : `${displayH}:${String(m).padStart(2, "0")} ${period}`
  }

  return `${fmt(s)} – ${fmt(e)}`
}

interface EventBlockProps {
  event: CalendarEvent
  index: number
}

export default function EventBlock({ event, index }: EventBlockProps) {
  // Parse start and end times
  const startDate = new Date(event.start)
  const endDate = new Date(event.end)

  const startHour = startDate.getHours()
  const startMin = startDate.getMinutes()
  const endHour = endDate.getHours()
  const endMin = endDate.getMinutes()

  // Positioning formula
  const startMinutes = (startHour - GRID_START_HOUR) * 60 + startMin
  const durationMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin)
  const topPx = (startMinutes / 60) * HOUR_HEIGHT
  const heightPx = Math.max((durationMinutes / 60) * HOUR_HEIGHT, 24)

  // Pick color
  const colorIndex = event.colorId
    ? (COLOR_ID_MAP[event.colorId] ?? index % COLOR_PALETTE.length)
    : index % COLOR_PALETTE.length
  const color = COLOR_PALETTE[colorIndex]

  const isShort = heightPx < 40

  return (
    <div
      className={`absolute left-1 right-1 rounded-md border-l-4 px-2 py-1 overflow-hidden cursor-pointer hover:brightness-95 transition-all ${color.bg} ${color.border} ${color.text}`}
      style={{ top: `${topPx}px`, height: `${heightPx}px` }}
      title={`${event.title}${event.location ? ` · ${event.location}` : ""}`}
    >
      <p className={`font-medium leading-tight truncate ${isShort ? "text-xs" : "text-sm"}`}>
        {event.title}
      </p>
      {!isShort && (
        <p className="text-xs opacity-75 truncate mt-0.5">
          {formatTimeRange(event.start, event.end)}
        </p>
      )}
      {!isShort && event.attendeeCount > 0 && (
        <p className="text-xs opacity-60 mt-0.5">
          {event.attendeeCount} attendee{event.attendeeCount !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  )
}
