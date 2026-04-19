import { signIn } from "@/lib/auth"
import { Calendar, Sparkles, CheckSquare } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo + App Name */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/40 mb-4">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">DayFlow</h1>
          <p className="mt-2 text-lg text-blue-300 font-medium">Your AI-powered day planner</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Feature highlights */}
          <div className="space-y-3 mb-8">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center mt-0.5">
                <Calendar className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-white font-medium text-sm">Google Calendar Sync</p>
                <p className="text-slate-400 text-sm">Seamlessly connect and view all your events in one place</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center mt-0.5">
                <CheckSquare className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-white font-medium text-sm">Smart Task Planning</p>
                <p className="text-slate-400 text-sm">Drag-and-drop tasks onto your calendar with intelligent scheduling</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center mt-0.5">
                <Sparkles className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-white font-medium text-sm">AI Day Optimization</p>
                <p className="text-slate-400 text-sm">Let AI suggest the best time blocks to maximize your productivity</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10 mb-8" />

          {/* Sign-in button */}
          <form
            action={async () => {
              "use server"
              await signIn("google", { redirectTo: "/dashboard/calendar" })
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-800 font-semibold py-3 px-6 rounded-xl transition-all duration-150 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              {/* Google G logo */}
              <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-slate-500">
            By signing in, you agree to grant DayFlow read access to your Google Calendar.
          </p>
        </div>

        <p className="text-center mt-6 text-slate-600 text-xs">
          DayFlow &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}
