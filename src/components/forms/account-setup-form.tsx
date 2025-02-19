'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CustomAvatar } from '@/components/ui/custom-avatar'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { AVATAR_OPTIONS } from '@/lib/avatars'

interface AccountSetupFormProps {
  user: any
}

export default function AccountSetupForm({ user }: AccountSetupFormProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [name, setName] = useState(user?.user_metadata?.name || '')
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          name,
          avatar_url: selectedAvatar,
        },
      })

      if (updateError) throw updateError

      router.refresh()
      router.push('/dashboard')
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Complete Your Profile</CardTitle>
        <CardDescription>Choose your display name and avatar to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Display Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Choose an Avatar</Label>
            <div className="grid grid-cols-4 gap-4">
              {AVATAR_OPTIONS.map((avatar) => (
                <button
                  key={avatar}
                  type="button"
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`p-2 rounded-lg transition-colors ${
                    selectedAvatar === avatar ? 'bg-primary/10' : 'hover:bg-accent'
                  }`}
                >
                  <CustomAvatar
                    className="h-12 w-12"
                    avatarUrl={avatar}
                  />
                </button>
              ))}
            </div>
          </div>

          <Button disabled={!name || !selectedAvatar || isLoading} className="w-full">
            {isLoading ? 'Setting up...' : 'Continue'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
