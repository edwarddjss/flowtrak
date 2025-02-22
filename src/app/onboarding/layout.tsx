import { auth } from "@/auth"
import { redirect } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) {
    redirect('/auth/signin')
  }

  // If user already has a profile, redirect to dashboard
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  if (profile) {
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
