import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import AddTaskForm from "../AddTaskForm"
import { usePlannerStore } from "@/store/planner"

beforeEach(() => {
  usePlannerStore.setState({ tasks: [] })
})

describe("AddTaskForm", () => {
  it("renders title input, duration select, priority select, and submit button", () => {
    render(<AddTaskForm />)
    expect(screen.getByPlaceholderText("Task title")).toBeInTheDocument()
    expect(screen.getByRole("combobox", { name: /duration/i })).toBeInTheDocument()
    expect(screen.getByRole("combobox", { name: /priority/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /add task/i })).toBeInTheDocument()
  })

  it("shows validation error when submitting with empty title", async () => {
    render(<AddTaskForm />)
    fireEvent.submit(screen.getByRole("form"))
    expect(await screen.findByText(/title is required/i)).toBeInTheDocument()
    expect(usePlannerStore.getState().tasks).toHaveLength(0)
  })

  it("does not add task when title is whitespace only", async () => {
    render(<AddTaskForm />)
    await userEvent.type(screen.getByPlaceholderText("Task title"), "   ")
    fireEvent.submit(screen.getByRole("form"))
    expect(usePlannerStore.getState().tasks).toHaveLength(0)
  })

  it("adds a task with correct values on valid submit", async () => {
    render(<AddTaskForm />)
    await userEvent.type(screen.getByPlaceholderText("Task title"), "Write sprint report")
    fireEvent.submit(screen.getByRole("form"))
    await waitFor(() => {
      const tasks = usePlannerStore.getState().tasks
      expect(tasks).toHaveLength(1)
      expect(tasks[0].title).toBe("Write sprint report")
      expect(tasks[0].duration).toBe(30)
      expect(tasks[0].priority).toBe("medium")
    })
  })

  it("resets title field after successful submit", async () => {
    render(<AddTaskForm />)
    const input = screen.getByPlaceholderText("Task title")
    await userEvent.type(input, "Write sprint report")
    fireEvent.submit(screen.getByRole("form"))
    await waitFor(() => expect(usePlannerStore.getState().tasks).toHaveLength(1))
    expect(input).toHaveValue("")
  })

  it("clears validation error when user starts typing", async () => {
    render(<AddTaskForm />)
    fireEvent.submit(screen.getByRole("form"))
    expect(await screen.findByText(/title is required/i)).toBeInTheDocument()
    await userEvent.type(screen.getByPlaceholderText("Task title"), "x")
    expect(screen.queryByText(/title is required/i)).not.toBeInTheDocument()
  })
})
