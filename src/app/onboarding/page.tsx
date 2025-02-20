'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Loader2 } from 'lucide-react'

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          router.replace('/auth/signin')
          return
        }

        // Check if user is already onboarded
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_onboarded')
          .eq('id', session.user.id)
          .single()

        if (profile?.is_onboarded) {
          router.replace('/dashboard')
        }
      } catch (error) {
        console.error('Error checking session:', error)
      }
    }

    checkSession()
  }, [router, supabase])

  const handleCompleteOnboarding = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.replace('/auth/signin')
        return
      }

      // Update user profile
      await supabase
        .from('profiles')
        .update({ is_onboarded: true })
        .eq('id', session.user.id)

      router.replace('/dashboard')
    } catch (error) {
      console.error('Error completing onboarding:', error)
    }
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
          <Button 
            onClick={handleCompleteOnboarding}
            className="w-full"
          >
            Get Started
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
