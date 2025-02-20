import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardNav } from '@/components/dashboard/nav'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()

  // Always use getUser() for server-side auth checks
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/auth/signin')
  }

  // Check if user is new and needs onboarding
  if (user.user_metadata.isNewUser) {
    redirect('/onboarding')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardNav user={user} />
      <main className="flex-1 bg-muted/10">
        {children}
      </main>
    </div>
  )
}
