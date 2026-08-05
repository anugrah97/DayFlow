import { GRID_END_HOUR, GRID_START_HOUR, HOUR_HEIGHT } from "@/components/calendar/TimeGrid"

export interface GridBlockPosition {
  topPx: number
  heightPx: number
  visible: boolean
}

const GRID_DURATION_MINUTES = (GRID_END_HOUR - GRID_START_HOUR) * 60

export function getGridBlockPosition(
  startIso: string,
  durationMinutes: number
): GridBlockPosition {
  const startDate = new Date(startIso)
  const startHour = startDate.getHours()
  const startMin = startDate.getMinutes()

  let startMinutes = (startHour - GRID_START_HOUR) * 60 + startMin

  if (startMinutes >= GRID_DURATION_MINUTES) {
    return { topPx: 0, heightPx: 0, visible: false }
  }

  startMinutes = Math.max(0, startMinutes)
  let duration = durationMinutes
  if (startMinutes + duration > GRID_DURATION_MINUTES) {
    duration = GRID_DURATION_MINUTES - startMinutes
  }

  return {
    topPx: (startMinutes / 60) * HOUR_HEIGHT,
    heightPx: Math.max((duration / 60) * HOUR_HEIGHT, 24),
    visible: duration > 0,
  }
}

export function isWithinGridHours(slotTime: string, durationMinutes: number): boolean {
  return getGridBlockPosition(slotTime, durationMinutes).visible
}
