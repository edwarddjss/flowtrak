'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AvatarSelector } from '@/components/avatar-selector'
import { createClient } from '@/lib/supabase/server'

export default async function AccountSetupPage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  
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
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>
            Choose an avatar to personalize your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AvatarSelector user={session.user} />
        </CardContent>
      </Card>
    </div>
  )
}
