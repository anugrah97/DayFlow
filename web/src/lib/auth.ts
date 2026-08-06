import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import {
  applyAccountToToken,
  applyTokenToSession,
  isAccessTokenFresh,
  isPathAuthorized,
  refreshAccessToken,
} from "@/lib/auth-callbacks"

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
    authorized({ auth, request }) {
      return isPathAuthorized(request.nextUrl.pathname, !!auth)
    },
    async jwt({ token, account }) {
      const nextToken = applyAccountToToken(token, account ?? undefined)
      if (isAccessTokenFresh(nextToken)) return nextToken
      return await refreshAccessToken(nextToken)
    },
    async session({ session, token }) {
      return applyTokenToSession(session, token)
    }
  }
})
