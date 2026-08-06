import { render, screen } from "@testing-library/react"
import DayView from "../DayView"

jest.mock("swr", () => ({
  __esModule: true,
  default: jest.fn(),
}))

import useSWR from "swr"

const mockUseSWR = useSWR as jest.Mock

describe("DayView", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("shows loading skeleton while fetching", () => {
    mockUseSWR.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
      mutate: jest.fn(),
    })

    const { container } = render(<DayView />)
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument()
  })

  it("shows the time grid when the API fails", () => {
    mockUseSWR.mockReturnValue({
      data: undefined,
      error: new Error("Unauthorized"),
      isLoading: false,
      mutate: jest.fn(),
    })

    render(<DayView extraChildren={<div data-testid="droppable-grid" />} />)
    expect(screen.getByText(/could not load events/i)).toBeInTheDocument()
    expect(screen.getByTestId("droppable-grid")).toBeInTheDocument()
  })

  it("renders timed events and keeps extra children", () => {
    mockUseSWR.mockReturnValue({
      data: {
        events: [
          {
            id: "e1",
            title: "Standup",
            start: new Date(new Date().setHours(9, 0, 0, 0)).toISOString(),
            end: new Date(new Date().setHours(9, 30, 0, 0)).toISOString(),
            attendeeCount: 0,
            allDay: false,
          },
        ],
        syncedAt: new Date().toISOString(),
      },
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
    })

    render(<DayView extraChildren={<div data-testid="task-overlay" />} />)
    expect(screen.getByText("Standup")).toBeInTheDocument()
    expect(screen.getByTestId("task-overlay")).toBeInTheDocument()
  })

  it("shows all-day events in a banner", () => {
    mockUseSWR.mockReturnValue({
      data: {
        events: [
          {
            id: "e2",
            title: "Company offsite",
            start: "2026-08-06",
            end: "2026-08-07",
            attendeeCount: 0,
            allDay: true,
          },
        ],
        syncedAt: new Date().toISOString(),
      },
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
    })

    render(<DayView />)
    expect(screen.getByText("Company offsite")).toBeInTheDocument()
    expect(screen.getByText(/^All day$/i)).toBeInTheDocument()
  })
})
