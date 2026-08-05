"use client"

import { signOut } from "next-auth/react"
import { clearAllPlannerStorage } from "@/store/planner"

export default function SignOutButton() {
  async function handleSignOut() {
    clearAllPlannerStorage()
    await signOut({ callbackUrl: "/login" })
  }

  return (
    <button
      type="button"
      onClick={() => void handleSignOut()}
      className="text-sm text-slate-500 hover:text-slate-800 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-colors"
    >
      Sign out
    </button>
  )
}
