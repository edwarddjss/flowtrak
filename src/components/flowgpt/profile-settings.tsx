'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Globe, Lock, Eye, EyeOff, User, Mail, AtSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { cn } from '@/lib/utils'
import { updateUserProfileAction, getUserProfileAction } from '@/app/client-actions'
import { useToast } from '@/components/ui/use-toast'
import { Avatar as AvatarType, avatars } from '@/lib/avatars'
import { CustomAvatar } from '@/components/ui/custom-avatar'
import AvatarSelector from '@/components/avatar-selector'

interface ProfileSettingsProps {
  onSaveAction?: () => void
  loading?: boolean
}

interface UserProfile {
  username: string
  email?: string
  publicProfile: boolean
  employerVisibility: boolean
  avatar_id?: string
}

export function ProfileSettings({ onSaveAction, loading = false }: ProfileSettingsProps) {
  const [profile, setProfile] = useState<UserProfile>({
    username: '',
    email: '',
    publicProfile: false,
    employerVisibility: false
  })
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarType | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const userProfile = await getUserProfileAction()
        setProfile({
          username: userProfile.username || '',
          email: userProfile.email || '',
          publicProfile: false,
          employerVisibility: false,
          avatar_id: userProfile.avatar_id
        })
        
        if (userProfile.avatar_id) {
          const avatar = avatars.find(a => a.id === userProfile.avatar_id)
          if (avatar) setSelectedAvatar(avatar)
        }
      } catch (error) {
        console.error('Error loading user profile:', error)
      }
    }
    loadUserProfile()
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateUserProfileAction({ 
        username: profile.username,
        avatar_id: selectedAvatar?.id
      })
      
      // Update user metadata with avatar info if selected
      if (selectedAvatar) {
        const supabase = createClientComponentClient()
        await supabase.auth.updateUser({
          data: {
            avatar_id: selectedAvatar.id,
            avatar_image: selectedAvatar.image,
            avatar_color: selectedAvatar.color
          }
        })
      }
      
      // Force a page refresh to update all components with new user data
      window.location.reload()
      
      toast({
        title: "Success",
        description: "Your profile has been updated.",
      })
      
      if (onSaveAction) {
        onSaveAction()
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="p-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Profile Settings</h2>
            <p className="text-sm text-muted-foreground">
              Manage your profile information and visibility settings.
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <Label>Avatar</Label>
              <AvatarSelector
                onSelect={setSelectedAvatar}
                selectedId={selectedAvatar?.id}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <AtSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  placeholder="Your username"
                  className="pl-8"
                  value={profile.username}
                  onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Your email"
                  className="pl-8"
                  value={profile.email}
                  onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                  disabled
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Public Profile</Label>
                  <p className="text-sm text-muted-foreground">
                    Make your profile visible to other users
                  </p>
                </div>
                <Switch
                  checked={profile.publicProfile}
                  onCheckedChange={(checked: boolean) => setProfile(prev => ({ ...prev, publicProfile: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Employer Visibility</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow employers to view your profile
                  </p>
                </div>
                <Switch
                  checked={profile.employerVisibility}
                  onCheckedChange={(checked: boolean) => setProfile(prev => ({ ...prev, employerVisibility: checked }))}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              onClick={handleSave}
              disabled={isSaving || loading}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
