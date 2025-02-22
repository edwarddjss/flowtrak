import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth/config"

const nextAuth = NextAuth(authConfig)

export const { auth, signIn, signOut } = nextAuth
export const { GET, POST } = nextAuth.handlers
