import { auth, signOut } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Calendar } from "lucide-react"
import Image from "next/image"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">DayFlow</span>
            </div>

            {/* User area */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name ?? "User avatar"}
                    width={32}
                    height={32}
                    className="rounded-full ring-2 ring-slate-200"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                    {session.user?.name?.[0]?.toUpperCase() ?? "U"}
                  </div>
                )}
                <span className="text-sm font-medium text-slate-700 hidden sm:block">
                  {session.user?.name}
                </span>
              </div>

              {/* Sign out */}
              <form
                action={async () => {
                  "use server"
                  await signOut({ redirectTo: "/login" })
                }}
              >
                <button
                  type="submit"
                  className="text-sm text-slate-500 hover:text-slate-800 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
