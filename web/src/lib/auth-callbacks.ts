import type { Session } from "next-auth"

export function isPathAuthorized(pathname: string, isAuthenticated: boolean): boolean {
  if (pathname.startsWith("/dashboard")) {
    return isAuthenticated
  }
  return true
}

interface OAuthAccount {
  access_token?: string
  refresh_token?: string
  expires_at?: number
}

export function applyAccountToToken(
  token: Record<string, unknown>,
  account?: OAuthAccount | null
): Record<string, unknown> {
  if (!account) return token
  return {
    ...token,
    accessToken: account.access_token,
    refreshToken: account.refresh_token,
    accessTokenExpires: account.expires_at,
  }
}

export function isAccessTokenFresh(
  token: Record<string, unknown>,
  nowMs: number = Date.now()
): boolean {
  const expiresAt = token.accessTokenExpires as number | undefined
  if (!expiresAt) return false
  return nowMs < expiresAt * 1000
}

export function applyTokenToSession(
  session: Session,
  token: Record<string, unknown>
): Session {
  if (token.error) {
    session.error = token.error as string
  }
  return session
}

export async function refreshAccessToken(
  token: Record<string, unknown>,
  fetchImpl: typeof fetch = fetch
): Promise<Record<string, unknown>> {
  try {
    const response = await fetchImpl("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken as string,
      }),
    })
    const refreshed = await response.json()
    if (!response.ok) throw refreshed
    return {
      ...token,
      accessToken: refreshed.access_token,
      accessTokenExpires: Math.floor(Date.now() / 1000) + refreshed.expires_in,
      refreshToken: refreshed.refresh_token ?? token.refreshToken,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "token_refresh_failed"
    console.error("Token refresh failed:", { message })
    return { ...token, error: "RefreshAccessTokenError" }
  }
}
