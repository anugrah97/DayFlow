import { CalendarEvent } from "@/lib/google-calendar"
import { getGridBlockPosition } from "@/lib/grid-position"

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

const COLOR_ID_MAP: Record<string, number> = {
  "1": 0, "2": 2, "3": 2, "4": 4, "5": 3, "6": 5, "7": 2, "8": 0, "9": 2, "10": 4, "11": 3,
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

function getEventDurationMinutes(start: string, end: string): number {
  const startMs = new Date(start).getTime()
  const endMs = new Date(end).getTime()
  return Math.max(Math.round((endMs - startMs) / 60_000), 15)
}

interface EventBlockProps {
  event: CalendarEvent
  index: number
}

export default function EventBlock({ event, index }: EventBlockProps) {
  if (event.allDay) return null

  const durationMinutes = getEventDurationMinutes(event.start, event.end)
  const { topPx, heightPx, visible } = getGridBlockPosition(event.start, durationMinutes)
  if (!visible) return null

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
