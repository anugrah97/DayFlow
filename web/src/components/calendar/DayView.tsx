"use client"

import useSWR from "swr"
import { RefreshCw } from "lucide-react"
import TimeGrid from "./TimeGrid"
import EventBlock from "./EventBlock"
import { CalendarEvent } from "@/lib/google-calendar"

interface EventsResponse {
  events: CalendarEvent[]
  syncedAt: string
}

async function fetcher(url: string): Promise<EventsResponse> {
  const res = await fetch(url)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? "Failed to fetch events")
  }
  return res.json()
}

function formatSyncedAt(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (diff < 10) return "just now"
  if (diff < 60) return `${diff}s ago`
  const mins = Math.floor(diff / 60)
  if (mins < 60) return `${mins} minute${mins !== 1 ? "s" : ""} ago`
  const hrs = Math.floor(mins / 60)
  return `${hrs} hour${hrs !== 1 ? "s" : ""} ago`
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex w-full">
        <div className="w-16 pr-2 space-y-10">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-3 bg-slate-200 rounded w-12 ml-auto" />
          ))}
        </div>
        <div className="flex-1 border-l border-slate-200 space-y-4 pl-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-14 bg-slate-100 rounded-md"
              style={{ marginTop: i === 0 ? "48px" : undefined }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function DayView() {
  const { data, error, isLoading, mutate } = useSWR<EventsResponse>(
    "/api/calendar/events",
    fetcher,
    { refreshInterval: 15 * 60 * 1000 }
  )

  return (
    <div className="w-full">
      {/* Header bar: sync status + refresh button */}
      <div className="flex items-center justify-between mb-4 min-h-[28px]">
        {data?.syncedAt ? (
          <span className="text-xs text-slate-400">
            Last synced: {formatSyncedAt(data.syncedAt)}
          </span>
        ) : (
          <span className="text-xs text-slate-300">Syncing…</span>
        )}
        <button
          onClick={() => mutate()}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 disabled:opacity-40 transition-colors px-2 py-1 rounded hover:bg-slate-100"
          aria-label="Refresh calendar"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-4">
          <span className="font-medium">Could not load events:</span> {error.message}
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading && !data && <LoadingSkeleton />}

      {/* Empty state */}
      {!isLoading && !error && data?.events.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
            <svg
              className="w-6 h-6 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5"
              />
            </svg>
          </div>
          <p className="text-slate-500 font-medium">No events today</p>
          <p className="text-slate-400 text-sm mt-1">Enjoy the free time!</p>
        </div>
      )}

      {/* Time grid with events */}
      {data && data.events.length > 0 && (
        <div className="overflow-y-auto max-h-[calc(100vh-220px)]">
          <TimeGrid>
            {data.events.map((event, i) => (
              <EventBlock key={event.id} event={event} index={i} />
            ))}
          </TimeGrid>
        </div>
      )}
    </div>
  )
}
