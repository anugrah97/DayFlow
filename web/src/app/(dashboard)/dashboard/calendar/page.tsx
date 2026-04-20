import DayView from "@/components/calendar/DayView"

export default function CalendarPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Today</h1>
      <DayView />
    </div>
  )
}
