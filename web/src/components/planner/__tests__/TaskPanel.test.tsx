import { render, screen } from "@testing-library/react"
import TaskPanel from "../TaskPanel"
import { usePlannerStore } from "@/store/planner"

beforeEach(() => {
  usePlannerStore.setState({ tasks: [] })
})

const defaultProps = {
  suggestions: [],
  onSuggestionsChange: jest.fn(),
  calendarEvents: [],
  onConflictWarning: jest.fn(),
}

describe("TaskPanel", () => {
  it("shows empty state when there are no tasks", () => {
    render(<TaskPanel {...defaultProps} />)
    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument()
  })

  it("lists unscheduled and scheduled tasks", () => {
    usePlannerStore.setState({
      tasks: [
        { id: "1", title: "Unscheduled task", duration: 30, priority: "medium" },
        {
          id: "2",
          title: "Scheduled task",
          duration: 60,
          priority: "high",
          scheduledAt: new Date().toISOString(),
        },
      ],
    })

    render(<TaskPanel {...defaultProps} />)
    expect(screen.getByText("Unscheduled task")).toBeInTheDocument()
    expect(screen.getByText("Scheduled task")).toBeInTheDocument()
    expect(screen.getByText("Scheduled")).toBeInTheDocument()
  })

  it("shows task count badge", () => {
    usePlannerStore.setState({
      tasks: [{ id: "1", title: "One", duration: 30, priority: "low" }],
    })
    render(<TaskPanel {...defaultProps} />)
    expect(screen.getByText("1")).toBeInTheDocument()
  })
})
