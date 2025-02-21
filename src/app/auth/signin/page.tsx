'use client'

import { Button } from "@/components/ui/button"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function SignIn() {
  const supabase = createClientComponentClient()

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-4 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Welcome to Flowtrak</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Sign in to start tracking your job applications
          </p>
        </div>
        <Button
          className="w-full"
          onClick={handleSignIn}
        >
          Continue with Google
        </Button>
      </div>
    </div>
  )
}
