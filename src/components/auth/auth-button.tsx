'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { signIn, signOut, useSession } from "next-auth/react"
import { Loader2 } from "lucide-react"

export function AuthButton() {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignOut = async () => {
    try {
      setIsLoading(true)
      await signOut({ callbackUrl: '/' })
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignIn = async () => {
    try {
      setIsLoading(true)
      await signIn('google', { callbackUrl: '/dashboard' })
    } catch (error) {
      console.error('Error signing in:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <Button disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Please wait
      </Button>
    )
  }

  if (session) {
    return (
      <Button
        variant="outline"
        onClick={handleSignOut}
      >
        Sign Out
      </Button>
    )
  }

  return (
    <Button onClick={handleSignIn}>
      Sign In with Google
    </Button>
  )
}
