"use client"

import { useSearchParams } from "next/navigation"

export default function LoginAlerts() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  if (error !== "SessionExpired") return null

  return (
    <div className="mb-6 rounded-lg border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
      Your session expired. Please sign in again to continue.
    </div>
  )
}
