import { render, screen } from "@testing-library/react"
import EventBlock from "../EventBlock"
import type { CalendarEvent } from "@/lib/google-calendar"

const timedEvent: CalendarEvent = {
  id: "e1",
  title: "Design Review",
  start: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
  end: new Date(new Date().setHours(11, 0, 0, 0)).toISOString(),
  attendeeCount: 3,
  allDay: false,
}

describe("EventBlock", () => {
  it("renders event title and time range", () => {
    render(<EventBlock event={timedEvent} index={0} />)
    expect(screen.getByText("Design Review")).toBeInTheDocument()
  })

  it("renders nothing for all-day events", () => {
    const { container } = render(
      <EventBlock
        event={{ ...timedEvent, allDay: true, start: "2026-08-06", end: "2026-08-07" }}
        index={0}
      />
    )
    expect(container).toBeEmptyDOMElement()
  })

  it("shows attendee count for taller blocks", () => {
    render(<EventBlock event={timedEvent} index={0} />)
    expect(screen.getByText(/3 attendees/i)).toBeInTheDocument()
  })
})
