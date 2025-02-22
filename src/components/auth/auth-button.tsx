'use client'

import { Button } from "@/components/ui/button"
import { signIn, signOut, useSession } from "next-auth/react"

export function AuthButton() {
  const { data: session } = useSession()

  if (session) {
    return (
      <Button
        variant="outline"
        onClick={() => signOut({ callbackUrl: '/' })}
      >
        Sign Out
      </Button>
    )
  }

  return (
    <Button
      onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
    >
      Sign In
    </Button>
  )
}
