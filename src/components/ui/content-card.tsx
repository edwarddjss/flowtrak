'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ContentCardProps {
  children: ReactNode
  className?: string
  interactive?: boolean
  gradient?: boolean
  glass?: boolean
  hover?: boolean
  animate?: boolean
}

export function ContentCard({
  children,
  className,
  interactive = false,
  gradient = false,
  glass = false,
  hover = false,
  animate = false,
}: ContentCardProps) {
  const Card = animate ? motion.div : 'div'
  
  return (
    <Card
      className={cn(
        'card',
        gradient && 'card-gradient',
        glass && 'glass-effect',
        hover && 'hover-effect',
        interactive && 'interactive-card',
        className
      )}
      {...(animate && {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3 }
      })}
    >
      {children}
    </Card>
  )
}
