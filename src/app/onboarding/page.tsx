'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function OnboardingPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleCompleteOnboarding = async () => {
    try {
      setLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.replace('/auth/signin')
        return
      }

      // Update user metadata to remove isNewUser flag
      await supabase.auth.updateUser({
        data: { isNewUser: false }
      })

      // Update profile in profiles table
      await supabase
        .from('profiles')
        .update({ is_onboarded: true })
        .eq('id', session.user.id)

      toast.success('Welcome to FlowTrak!')
      router.replace('/dashboard')
    } catch (error) {
      console.error('Error completing onboarding:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-lg py-12">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to FlowTrak!</CardTitle>
          <CardDescription>
            Let's get you started with tracking your job applications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            FlowTrak helps you organize and track your job applications in one place.
            You can:
          </p>
          <ul className="list-disc pl-4 space-y-2 text-sm text-muted-foreground">
            <li>Track application statuses</li>
            <li>Set reminders for follow-ups</li>
            <li>Store important documents</li>
            <li>Analyze your application progress</li>
          </ul>
          <Button 
            className="w-full" 
            onClick={handleCompleteOnboarding}
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Get Started
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
