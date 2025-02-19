'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { ApplicationsProvider } from '@/lib/contexts/applications-context'
import { AuthenticatedLayoutContent } from '@/components/authenticated-layout'

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth/signin')
      }
    }
    checkAuth()
  }, [supabase, router])

  return (
    <ApplicationsProvider>
      <AuthenticatedLayoutContent>
        {children}
      </AuthenticatedLayoutContent>
    </ApplicationsProvider>
  )
}
