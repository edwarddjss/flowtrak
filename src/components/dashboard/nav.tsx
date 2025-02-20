'use client'

import Link from 'next/link'
import { User } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

interface DashboardNavProps {
  user: User
}

export function DashboardNav({ user }: DashboardNavProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.replace('/auth/signin')
  }

  return (
    <nav className="border-b">
      <div className="container flex h-16 items-center px-4">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <span className="text-xl font-bold">FlowTrak</span>
        </Link>
        <div className="ml-auto flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">
            {user.email}
          </span>
          <Button 
            variant="ghost" 
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  )
}
