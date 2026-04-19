import { auth } from "@/lib/auth"
import { Calendar } from "lucide-react"

export default async function CalendarPage() {
  const session = await auth()

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 mb-6">
        <Calendar className="w-8 h-8 text-blue-600" />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Sprint 2: Calendar coming soon</h1>
      <p className="text-slate-500 mb-6 max-w-sm">
        The full calendar view with Google Calendar integration is being built in Sprint 2.
      </p>
      <div className="bg-green-50 border border-green-200 rounded-xl px-6 py-4 text-sm">
        <p className="text-green-700 font-medium">Auth is working!</p>
        <p className="text-green-600 mt-1">
          Signed in as: <span className="font-semibold">{session?.user?.email}</span>
        </p>
      </div>
    </div>
  )
}
