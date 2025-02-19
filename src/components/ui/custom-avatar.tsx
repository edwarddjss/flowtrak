'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface CustomAvatarProps {
  userId: string
  className?: string
  fallback?: string
}

export function CustomAvatar({ userId, className, fallback = '?' }: CustomAvatarProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [fallbackBg, setFallbackBg] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchUserAvatar = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // If user has selected a custom avatar
        if (user.user_metadata?.avatar_image) {
          setAvatarUrl(user.user_metadata.avatar_image)
          setFallbackBg(user.user_metadata.avatar_color)
        } 
        // Otherwise use Google avatar
        else if (user.user_metadata?.picture || user.user_metadata?.avatar_url) {
          setAvatarUrl(user.user_metadata.picture || user.user_metadata.avatar_url)
          setFallbackBg(null)
        }
      }
    }

    fetchUserAvatar()

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'USER_UPDATED' && session?.user) {
        const { avatar_image, avatar_color, picture, avatar_url } = session.user.user_metadata
        if (avatar_image) {
          setAvatarUrl(avatar_image)
          setFallbackBg(avatar_color)
        } else {
          setAvatarUrl(picture || avatar_url)
          setFallbackBg(null)
        }
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, userId])

  return (
    <Avatar className={className}>
      <AvatarImage src={avatarUrl || ''} alt="User avatar" />
      <AvatarFallback style={fallbackBg ? { backgroundColor: fallbackBg } : undefined}>
        <span className={fallbackBg ? 'text-white' : undefined}>{fallback}</span>
      </AvatarFallback>
    </Avatar>
  )
}
