import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import OptimizationPanel from "../OptimizationPanel"
import { usePlannerStore } from "@/store/planner"

beforeEach(() => {
  usePlannerStore.setState({ tasks: [] })
  jest.restoreAllMocks()
})

describe("OptimizationPanel", () => {
  it("disables optimize button when there are no unscheduled tasks", () => {
    render(<OptimizationPanel suggestions={[]} onSuggestionsChange={jest.fn()} />)
    expect(screen.getByRole("button", { name: /optimize my day/i })).toBeDisabled()
  })

  it("enables optimize button when unscheduled tasks exist", () => {
    usePlannerStore.setState({
      tasks: [{ id: "1", title: "Deep work", duration: 60, priority: "high" }],
    })
    render(<OptimizationPanel suggestions={[]} onSuggestionsChange={jest.fn()} />)
    expect(screen.getByRole("button", { name: /optimize my day/i })).toBeEnabled()
  })

  it("shows suggestions with accept and dismiss actions", async () => {
    const onChange = jest.fn()
    usePlannerStore.setState({
      tasks: [{ id: "task-1", title: "Email client", duration: 30, priority: "medium" }],
    })

    render(
      <OptimizationPanel
        suggestions={[
          {
            taskId: "task-1",
            scheduledAt: "2026-08-05T14:00:00.000Z",
            reason: "Free block after lunch",
          },
        ]}
        onSuggestionsChange={onChange}
      />
    )

    expect(screen.getByText("Email client")).toBeInTheDocument()
    expect(screen.getByText(/free block after lunch/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /accept all/i })).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: /^accept$/i }))
    await waitFor(() => {
      expect(usePlannerStore.getState().tasks[0].scheduledAt).toBe("2026-08-05T14:00:00.000Z")
    })
    expect(onChange).toHaveBeenCalledWith([])
  })

  it("shows error when API returns failure", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "AI optimization is not configured" }),
    })

    usePlannerStore.setState({
      tasks: [{ id: "1", title: "Task", duration: 30, priority: "low" }],
    })

    render(<OptimizationPanel suggestions={[]} onSuggestionsChange={jest.fn()} />)
    fireEvent.click(screen.getByRole("button", { name: /optimize my day/i }))

    expect(await screen.findByText(/not configured/i)).toBeInTheDocument()
  })
})
