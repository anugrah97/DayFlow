import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import OptimizationPanel from "../OptimizationPanel"
import { usePlannerStore } from "@/store/planner"

const defaultProps = {
  calendarEvents: [],
  onConflictWarning: jest.fn(),
}

beforeEach(() => {
  usePlannerStore.setState({ tasks: [] })
  jest.restoreAllMocks()
})

describe("OptimizationPanel", () => {
  it("disables optimize button when there are no unscheduled tasks", () => {
    render(<OptimizationPanel suggestions={[]} onSuggestionsChange={jest.fn()} {...defaultProps} />)
    expect(screen.getByRole("button", { name: /optimize my day/i })).toBeDisabled()
  })

  it("shows Anthropic data disclosure", () => {
    render(<OptimizationPanel suggestions={[]} onSuggestionsChange={jest.fn()} {...defaultProps} />)
    expect(screen.getByText(/sent to Anthropic/i)).toBeInTheDocument()
  })

  it("enables optimize button when unscheduled tasks exist", () => {
    usePlannerStore.setState({
      tasks: [{ id: "1", title: "Deep work", duration: 60, priority: "high" }],
    })
    render(<OptimizationPanel suggestions={[]} onSuggestionsChange={jest.fn()} {...defaultProps} />)
    expect(screen.getByRole("button", { name: /optimize my day/i })).toBeEnabled()
  })

  it("shows suggestions with accept and dismiss actions", async () => {
    const onChange = jest.fn()
    usePlannerStore.setState({
      tasks: [{ id: "task-1", title: "Email client", duration: 30, priority: "medium" }],
    })

    const scheduledAt = new Date()
    scheduledAt.setHours(14, 0, 0, 0)

    render(
      <OptimizationPanel
        suggestions={[
          {
            taskId: "task-1",
            scheduledAt: scheduledAt.toISOString(),
            reason: "Free block after lunch",
          },
        ]}
        onSuggestionsChange={onChange}
        {...defaultProps}
      />
    )

    expect(screen.getByText("Email client")).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: /^accept$/i }))
    await waitFor(() => {
      expect(usePlannerStore.getState().tasks[0].scheduledAt).toBe(scheduledAt.toISOString())
    })
    expect(onChange).toHaveBeenCalledWith([])
  })

  it("blocks accept when suggestion is outside grid hours", () => {
    const onChange = jest.fn()
    const onConflictWarning = jest.fn()
    usePlannerStore.setState({
      tasks: [{ id: "task-1", title: "Late task", duration: 30, priority: "low" }],
    })

    const late = new Date()
    late.setHours(23, 0, 0, 0)

    render(
      <OptimizationPanel
        suggestions={[
          {
            taskId: "task-1",
            scheduledAt: late.toISOString(),
            reason: "Too late",
          },
        ]}
        onSuggestionsChange={onChange}
        calendarEvents={[]}
        onConflictWarning={onConflictWarning}
      />
    )

    fireEvent.click(screen.getByRole("button", { name: /^accept$/i }))
    expect(onConflictWarning).toHaveBeenCalled()
    expect(usePlannerStore.getState().tasks[0].scheduledAt).toBeUndefined()
    expect(onChange).not.toHaveBeenCalled()
  })

  it("shows error when API returns failure", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "AI optimization is not configured" }),
    })

    usePlannerStore.setState({
      tasks: [{ id: "1", title: "Task", duration: 30, priority: "low" }],
    })

    render(<OptimizationPanel suggestions={[]} onSuggestionsChange={jest.fn()} {...defaultProps} />)
    fireEvent.click(screen.getByRole("button", { name: /optimize my day/i }))

    expect(await screen.findByText(/not configured/i)).toBeInTheDocument()
  })
})
