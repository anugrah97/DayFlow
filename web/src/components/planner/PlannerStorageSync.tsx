"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { getPlannerStorageKey, usePlannerStore } from "@/store/planner"

export default function PlannerStorageSync() {
  const { data: session } = useSession()
  const userId = session?.user?.email ?? session?.user?.id

  useEffect(() => {
    if (!userId) return
    usePlannerStore.persist.setOptions({ name: getPlannerStorageKey(userId) })
    void usePlannerStore.persist.rehydrate()
  }, [userId])

  return null
}
