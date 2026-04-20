import { getToken } from "next-auth/jwt"
import { getTodaysEvents } from "@/lib/google-calendar"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!token?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const events = await getTodaysEvents(token.accessToken as string)
    return NextResponse.json({ events, syncedAt: new Date().toISOString() })
  } catch (error) {
    console.error("Calendar fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch calendar" }, { status: 500 })
  }
}
