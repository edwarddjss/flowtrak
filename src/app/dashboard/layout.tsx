'use client'

import { ApplicationsProvider } from '@/lib/contexts/applications-context'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardNav } from '@/components/dashboard/nav'
import { cookies } from 'next/headers'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/signin')
  }

  // Check if user is new and needs onboarding
  if (session.user.user_metadata.isNewUser) {
    redirect('/onboarding')
  }

  return (
    <ApplicationsProvider>
      <div className="flex min-h-screen flex-col">
        <DashboardNav user={session.user} />
        <main className="flex-1 bg-muted/10">
          {children}
        </main>
      </div>
    </ApplicationsProvider>
  )
}
