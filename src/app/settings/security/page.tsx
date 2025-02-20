'use client'

import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from '@/components/ui/use-toast'
import { Shield, Key } from 'lucide-react'

export default function SecurityPage() {
  const supabase = createClientComponentClient()

  const handlePasswordReset = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user?.email) throw new Error('No email found')

      const { error } = await supabase.auth.resetPasswordForEmail(user.email)
      if (error) throw error

      toast({
        title: 'Password reset email sent',
        description: 'Check your email for the password reset link.',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send password reset email',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Security</h3>
        <p className="text-sm text-muted-foreground">
          Manage your account security settings.
        </p>
      </div>
      <Separator />
      
      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>
            Change your password or request a password reset.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handlePasswordReset} className="w-full sm:w-auto">
            <Key className="mr-2 h-4 w-4" />
            Send Password Reset Email
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>
            Add an extra layer of security to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full sm:w-auto">
            <Shield className="mr-2 h-4 w-4" />
            Enable Two-Factor Auth
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>
            Manage your active login sessions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md bg-muted p-4">
            <div className="text-sm">
              <p className="font-medium">Current Session</p>
              <p className="text-muted-foreground">
                Last accessed from Windows • Chrome • United States
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
