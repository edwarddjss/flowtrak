'use client'

import { useSession } from "next-auth/react"

export function useUser() {
  const { data: session, status } = useSession()
  
  return {
    user: session?.user,
    profile: session?.user?.profile,
    isLoading: status === "loading",
    isAdmin: session?.user?.profile?.is_admin || false,
    isVerified: session?.user?.profile?.is_verified || false
  }
}
