'use client'

import { UserNav } from '@/components/user-nav'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { ModeToggle } from '@/components/mode-toggle'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'

export function SiteHeader() {
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  if (!user) return null

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
      <div className="container flex h-16 items-center">
        <Link href="/dashboard" className="mr-6">
          <h1 className="text-xl font-bold gradient-text">FlowTrak</h1>
        </Link>
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
          <UserNav user={user} />
        </div>
      </div>
    </header>
  )
}
