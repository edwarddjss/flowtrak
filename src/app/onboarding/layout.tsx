import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default async function OnboardingLayout({
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

  // If user is not new or has completed onboarding, redirect to dashboard
  if (!session.user.user_metadata.isNewUser) {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 bg-muted/10">
        {children}
      </main>
    </div>
  )
}
