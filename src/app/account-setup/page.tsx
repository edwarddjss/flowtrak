import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { AccountSetup } from '@/app/(authenticated)/onboarding/account-setup'

export default async function AccountSetupPage() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: cookieStore })
  
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/signin')
  }

  // Check if user already has an avatar
  const { avatar_id } = session.user.user_metadata
  if (avatar_id) {
    redirect('/dashboard')
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <AccountSetup user={session.user} />
    </div>
  )
}
