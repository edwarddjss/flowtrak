'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'

export function AuthButton() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
        router.refresh()
      })

      return () => subscription.unsubscribe()
    }

    getUser()
  }, [supabase, router])

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`
      }
    })
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return <button className="btn btn-ghost loading">Loading...</button>
  }

  if (user) {
    return (
      <button
        className="btn btn-primary"
        onClick={handleSignOut}
      >
        Sign Out
      </button>
    )
  }

  return (
    <button
      className="btn btn-primary"
      onClick={handleSignIn}
    >
      Sign In with Google
    </button>
  )
}
