'use client'

import { useState, useEffect } from 'react'
import { User } from '@supabase/auth-helpers-nextjs'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useRouter } from 'next/navigation'
import { DeleteAccountDialog } from '@/components/delete-account-dialog'
import { AlertCircle } from 'lucide-react'
import { Avatar as AvatarType, avatars } from '@/lib/avatars'
import { CustomAvatar } from '@/components/ui/custom-avatar'
import AvatarSelector from '@/components/avatar-selector'

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    bio: '',
  })
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarType | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        setFormData({
          email: user.email || '',
          name: user.user_metadata?.name || '',
          bio: user.user_metadata?.bio || '',
        })
        
        // Set selected avatar if user has one
        if (user.user_metadata?.avatar_id) {
          const avatar = avatars.find(a => a.id === user.user_metadata.avatar_id)
          if (avatar) setSelectedAvatar(avatar)
        }
      }
    }
    getUser()
  }, [supabase.auth])

  const handleUpdateProfile = async () => {
    try {
      setIsLoading(true)
      
      // Update user metadata including avatar
      const { error } = await supabase.auth.updateUser({
        data: {
          name: formData.name,
          bio: formData.bio,
          avatar_id: selectedAvatar?.id,
          avatar_image: selectedAvatar?.image,
          avatar_color: selectedAvatar?.color
        }
      })
      
      if (error) throw error

      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      })
      
      router.refresh()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateEmail = async () => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.updateUser({ email: formData.email })
      
      if (error) throw error

      toast({
        title: 'Email update initiated',
        description: 'Please check your email to confirm the change',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update email',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Public Profile</CardTitle>
          <CardDescription>This information will be displayed publicly.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <CustomAvatar userId={user.id} className="h-16 w-16" />
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Profile Picture</h4>
              <p className="text-sm text-muted-foreground">
                Your profile picture is managed through Google, or choose a custom avatar below
              </p>
              <div className="flex items-center gap-2 mt-2">
                <AvatarSelector
                  onSelect={async (avatar) => {
                    setSelectedAvatar(avatar);
                    setIsLoading(true);
                    try {
                      const { error } = await supabase.auth.updateUser({
                        data: {
                          avatar_id: avatar.id,
                          avatar_image: avatar.image,
                          avatar_color: avatar.color
                        }
                      });
                      if (error) throw error;
                      toast({ title: 'Profile picture updated' });
                      router.refresh();
                    } catch (error) {
                      toast({
                        title: 'Error',
                        description: 'Failed to update profile picture',
                        variant: 'destructive',
                      });
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  selectedId={selectedAvatar?.id}
                  size="xs"
                />
                {selectedAvatar && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={async () => {
                      setIsLoading(true);
                      try {
                        const { error } = await supabase.auth.updateUser({
                          data: {
                            avatar_id: null,
                            avatar_image: null,
                            avatar_color: null
                          }
                        });
                        if (error) throw error;
                        setSelectedAvatar(null);
                        toast({ title: 'Profile picture reset' });
                        router.refresh();
                      } catch (error) {
                        toast({
                          title: 'Error',
                          description: 'Failed to update profile picture',
                          variant: 'destructive',
                        });
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                  >
                    Reset
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Display Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bio">AI Context</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us about yourself, your goals, and preferences. This information helps our AI features provide more personalized assistance."
                className="min-h-[100px]"
              />
              <p className="text-sm text-muted-foreground">
                This information helps our AI features understand your background and provide more relevant suggestions for job applications and interview preparation.
              </p>
            </div>

            <Button onClick={handleUpdateProfile} disabled={isLoading}>
              Update Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email Settings</CardTitle>
          <CardDescription>
            Update your email address. You'll need to verify any changes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <Button onClick={handleUpdateEmail} disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/5 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-base font-medium">Account Management</CardTitle>
          <CardDescription>
            Manage your account settings and data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="outline" 
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            <AlertCircle className="w-4 h-4 mr-2" />
            Delete Account
          </Button>
        </CardContent>
      </Card>

      <DeleteAccountDialog 
        open={showDeleteDialog} 
        onOpenChange={setShowDeleteDialog}
      />
    </div>
  )
}
