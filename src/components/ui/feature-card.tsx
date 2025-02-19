'use client'

import { motion } from 'framer-motion'
import { IconType } from '@tabler/icons-react'
import { Text, Tooltip, UnstyledButton } from '@mantine/core'
import { useHover } from '@mantine/hooks'

interface FeatureCardProps {
  id: string
  name: string
  description: string
  icon: IconType
  isActive: boolean
  onClick: () => void
  steps?: string[]
}

export function FeatureCard({
  id,
  name,
  description,
  icon: Icon,
  isActive,
  onClick,
  steps
}: FeatureCardProps) {
  const { hovered, ref } = useHover()
  
  return (
    <Tooltip.Floating
      label={
        steps && (
          <div className="p-3 max-w-xs">
            <Text size="sm" fw={500} mb="xs">How it works:</Text>
            <ol className="space-y-1.5">
              {steps.map((step, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-0.5 flex-none w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium">
                    {i + 1}
                  </span>
                  <span className="flex-1 text-white/80">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )
      }
      disabled={!steps}
      position="bottom"
      offset={12}
      transitionProps={{ duration: 200 }}
    >
      <UnstyledButton
        ref={ref}
        onClick={onClick}
        className={`
          relative group overflow-hidden rounded-2xl border transition-all duration-300
          ${isActive 
            ? 'border-primary/20 bg-primary/[0.03]' 
            : 'border-white/[0.08] hover:border-white/[0.12] bg-white/[0.02] hover:bg-white/[0.04]'
          }
        `}
      >
        <motion.div 
          className="p-6 space-y-4"
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          <div className="relative">
            <div className={`
              absolute inset-0 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500
              ${isActive ? 'bg-primary/20' : 'bg-white/[0.08]'}
            `} />
            <div className={`
              relative h-12 w-12 rounded-xl border flex items-center justify-center
              transition-all duration-300 group-hover:scale-[1.02]
              ${isActive 
                ? 'border-primary/20 bg-primary/[0.08]' 
                : 'border-white/[0.08] bg-white/[0.04] group-hover:border-white/[0.12] group-hover:bg-white/[0.08]'
              }
            `}>
              <Icon 
                size={24} 
                className={`transition-colors duration-300 ${
                  isActive ? 'text-primary' : 'text-white/60 group-hover:text-white/90'
                }`}
                stroke={1.5}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Text className={`font-medium transition-colors duration-300 ${
              isActive ? 'text-primary' : 'text-white/90'
            }`}>
              {name}
            </Text>
            <Text size="sm" className="text-white/50 leading-relaxed">
              {description}
            </Text>
          </div>

          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary/80"
            initial={false}
            animate={{
              scaleX: isActive ? 1 : 0,
              opacity: isActive ? 1 : 0
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </UnstyledButton>
    </Tooltip.Floating>
  )
}
