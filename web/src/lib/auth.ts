import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

async function refreshAccessToken(token: Record<string, unknown>) {
  try {
    const url = "https://oauth2.googleapis.com/token"
    const response = await fetch(url, {
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
  } catch {
    return { ...token, error: "RefreshAccessTokenError" }
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/calendar.readonly",
          access_type: "offline",
          prompt: "consent",
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.accessTokenExpires = account.expires_at
      }
      // Return token if not expired
      if (Date.now() < (token.accessTokenExpires as number) * 1000) return token
      // Refresh if expired
      return await refreshAccessToken(token)
    },
    async session({ session, token }) {
      // accessToken stays server-side only — NOT forwarded to client session
      if (token.error) session.error = token.error as string
      return session
    }
  }
})
