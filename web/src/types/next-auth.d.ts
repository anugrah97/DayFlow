import "next-auth"
declare module "next-auth" {
  interface Session {
    error?: string
  }
}
import "next-auth/jwt"
declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    refreshToken?: string
    accessTokenExpires?: number
    error?: string
  }
}
