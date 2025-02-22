import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      profile?: {
        id: string
        email: string
        is_verified: boolean
        is_admin: boolean
        created_at: string
      }
    } & DefaultSession["user"]
  }
}
