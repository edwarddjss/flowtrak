'use client'

import { useState } from 'react'
import { Avatar as AvatarType, avatars } from '@/lib/avatars'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface AvatarSelectorProps {
  onSelect: (avatar: AvatarType) => void
  selectedId?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

export default function AvatarSelector({ onSelect, selectedId, size = 'md' }: AvatarSelectorProps) {
  const sizeClasses = {
    xs: {
      grid: 'grid-cols-8 gap-1',
      avatar: 'w-6 h-6',
      button: 'p-0.5'
    },
    sm: {
      grid: 'grid-cols-6 gap-2',
      avatar: 'w-8 h-8',
      button: 'p-1'
    },
    md: {
      grid: 'grid-cols-4 gap-3',
      avatar: 'w-12 h-12',
      button: 'p-2'
    },
    lg: {
      grid: 'grid-cols-3 gap-4',
      avatar: 'w-16 h-16',
      button: 'p-3'
    }
  }

  return (
    <div className={cn("grid", sizeClasses[size].grid)}>
      {avatars.map((avatar) => (
        <button
          key={avatar.id}
          onClick={() => onSelect(avatar)}
          className={cn(
            "flex items-center justify-center rounded-md transition-all",
            sizeClasses[size].button,
            "hover:bg-accent",
            selectedId === avatar.id && "bg-accent"
          )}
        >
          <Avatar className={sizeClasses[size].avatar}>
            <AvatarImage src={avatar.image} alt={avatar.name} />
          </Avatar>
        </button>
      ))}
    </div>
  )
}
