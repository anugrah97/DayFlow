import { google } from "googleapis"

export interface CalendarEvent {
  id: string
  title: string
  start: string        // ISO string
  end: string          // ISO string
  attendeeCount: number
  colorId?: string
  location?: string
}

export async function getTodaysEvents(accessToken: string): Promise<CalendarEvent[]> {
  const auth = new google.auth.OAuth2()
  auth.setCredentials({ access_token: accessToken })

  const calendar = google.calendar({ version: "v3", auth })
  const today = new Date()
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0).toISOString()
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59).toISOString()

  const res = await calendar.events.list({
    calendarId: "primary",
    timeMin: startOfDay,
    timeMax: endOfDay,
    singleEvents: true,
    orderBy: "startTime",
  })

  return (res.data.items ?? []).map(event => ({
    id: event.id ?? crypto.randomUUID(),
    title: event.summary ?? "Untitled event",
    start: event.start?.dateTime ?? event.start?.date ?? "",
    end: event.end?.dateTime ?? event.end?.date ?? "",
    attendeeCount: event.attendees?.length ?? 0,
    colorId: event.colorId ?? undefined,
    location: event.location ?? undefined,
  }))
}
