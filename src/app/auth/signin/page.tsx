'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { signIn, useSession } from "next-auth/react"
import { Loader2 } from "lucide-react"
import { redirect } from "next/navigation"
import { useSearchParams } from "next/navigation"

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  // Redirect if already authenticated
  if (session) {
    redirect('/dashboard')
  }

  const handleSignIn = async () => {
    try {
      setIsLoading(true)
      await signIn("google", { callbackUrl: "/dashboard" })
    } catch (error) {
      console.error('Error signing in:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-4 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Welcome to Flowtrak</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Sign in to start tracking your job applications
          </p>
          {error && (
            <p className="text-sm text-red-500">
              {error === 'OAuthSignin' && 'Error signing in with Google. Please try again.'}
              {error === 'OAuthCallback' && 'Error completing sign in. Please try again.'}
              {error === 'OAuthCreateAccount' && 'Error creating account. Please try again.'}
              {error === 'EmailCreateAccount' && 'Error creating account. Please try again.'}
              {error === 'Callback' && 'Error during authentication. Please try again.'}
              {error === 'Default' && 'An error occurred. Please try again.'}
            </p>
          )}
        </div>
        <Button
          className="w-full"
          onClick={handleSignIn}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            'Continue with Google'
          )}
        </Button>
      </div>
    </div>
  )
}
