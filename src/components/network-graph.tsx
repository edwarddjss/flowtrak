'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
}

function ParticleAnimation() {
  const { theme, systemTheme } = useTheme()
  const [particles, setParticles] = useState<Particle[]>([])
  
  // Determine if dark mode is active
  const isDark = theme === 'dark' || (theme === 'system' && systemTheme === 'dark')

  useEffect(() => {
    const generateParticles = () => {
      const newParticles: Particle[] = []
      for (let i = 0; i < 20; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 8 + 4,
          duration: Math.random() * 15 + 15,
          delay: Math.random() * 10
        })
      }
      setParticles(newParticles)
    }

    generateParticles()
    const interval = setInterval(generateParticles, 30000)
    return () => clearInterval(interval)
  }, [])

  // Define theme-specific styles
  const particleStyle = isDark ? {
    background: 'radial-gradient(circle at center, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%)',
    filter: 'blur(1.5px)',
    mixBlendMode: 'lighten' as const
  } : {
    background: 'radial-gradient(circle at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 70%)',
    filter: 'blur(1.5px)',
    mixBlendMode: 'darken' as const
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            ...particleStyle,
            willChange: 'transform'
          }}
          initial={{ 
            scale: 0,
            opacity: 0 
          }}
          animate={{
            scale: [0, 1, 1, 0],
            opacity: [0, 0.8, 0.8, 0],
            x: [0, Math.random() * 200 - 100],
            y: [0, Math.random() * 200 - 100]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}

// Export the component wrapper
export default function NetworkGraphCanvas() {
  return (
    <div className="relative w-full h-full min-h-[600px]">
      <ParticleAnimation />
    </div>
  )
}
