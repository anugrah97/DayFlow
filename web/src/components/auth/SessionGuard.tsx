"use client"

import { useEffect } from "react"
import { signOut, useSession } from "next-auth/react"
import { clearAllPlannerStorage } from "@/store/planner"

export default function SessionGuard({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      clearAllPlannerStorage()
      void signOut({ callbackUrl: "/login?error=SessionExpired" })
    }
  }, [session?.error])

  return <>{children}</>
}
