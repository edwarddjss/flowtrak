'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'

async function completeOnboarding() {
  'use server'
  
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  
  await supabase.auth.updateUser({
    data: { isNewUser: false }
  })
  
  redirect('/dashboard')
}

export default async function OnboardingPage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to FlowTrak!</CardTitle>
          <CardDescription>
            Let&apos;s get you started with tracking your job applications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            FlowTrak helps you organize and track your job applications in one place.
            You can:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li>Track application status and important dates</li>
            <li>Set reminders for follow-ups</li>
            <li>Monitor your application pipeline</li>
            <li>Analyze your job search progress</li>
          </ul>
          <form action={completeOnboarding}>
            <Button type="submit" className="w-full mt-4">
              Get Started
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
