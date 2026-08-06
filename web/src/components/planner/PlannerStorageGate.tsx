"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import {
  getPlannerStorageKey,
  usePlannerStore,
} from "@/store/planner"

export default function PlannerStorageGate({
  children,
}: {
  children: React.ReactNode
}) {
  const { status, data: session } = useSession()
  const userId =
    status === "authenticated"
      ? (session?.user?.email ?? session?.user?.id ?? null)
      : null

  const [hydratedUserId, setHydratedUserId] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return

    let cancelled = false
    usePlannerStore.persist.setOptions({ name: getPlannerStorageKey(userId) })
    const rehydrate = usePlannerStore.persist.rehydrate()
    const onReady = () => {
      if (!cancelled) setHydratedUserId(userId)
    }
    if (rehydrate instanceof Promise) {
      void rehydrate.then(onReady)
    } else {
      onReady()
    }

    return () => {
      cancelled = true
    }
  }, [userId])

  const ready = Boolean(userId && hydratedUserId === userId)

  if (status === "loading" || !ready) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-sm text-slate-500">Loading your planner…</p>
      </div>
    )
  }

  return <>{children}</>
}
