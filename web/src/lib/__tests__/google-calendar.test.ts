import { getTodaysEvents } from "../google-calendar"

const mockList = jest.fn()

jest.mock("googleapis", () => ({
  google: {
    calendar: jest.fn(() => ({
      events: { list: mockList },
    })),
    auth: {
      OAuth2: jest.fn(() => ({
        setCredentials: jest.fn(),
      })),
    },
  },
}))

describe("getTodaysEvents", () => {
  beforeEach(() => {
    mockList.mockReset()
  })

  it("maps Google events into DayFlow calendar events", async () => {
    mockList.mockResolvedValue({
      data: {
        items: [
          {
            id: "evt-1",
            summary: "Team sync",
            start: { dateTime: "2026-08-06T10:00:00Z" },
            end: { dateTime: "2026-08-06T11:00:00Z" },
            attendees: [{}, {}],
          },
          {
            id: "evt-2",
            summary: "Holiday",
            start: { date: "2026-08-06" },
            end: { date: "2026-08-07" },
          },
        ],
      },
    })

    const events = await getTodaysEvents("access-token")

    expect(events).toHaveLength(2)
    expect(events[0]).toMatchObject({
      id: "evt-1",
      title: "Team sync",
      attendeeCount: 2,
      allDay: false,
    })
    expect(events[1]).toMatchObject({
      title: "Holiday",
      allDay: true,
    })
    expect(mockList).toHaveBeenCalledWith(
      expect.objectContaining({
        calendarId: "primary",
        singleEvents: true,
        orderBy: "startTime",
      })
    )
  })
})
