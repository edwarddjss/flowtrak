'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const companies = [
  'google.com',
  'microsoft.com',
  'meta.com',
  'amazon.com',
  'apple.com',
  'netflix.com',
  'uber.com',
  'airbnb.com',
  'spotify.com',
  'stripe.com',
].map(domain => ({
  name: domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1),
  logo: `https://logo.clearbit.com/${domain}`
}))

export function TrustedBy() {
  const [visibleCompanies, setVisibleCompanies] = useState(companies.slice(0, 3))
  const [isAnimating, setIsAnimating] = useState(false)
  const [failedLogos, setFailedLogos] = useState<Set<string>>(new Set())

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setVisibleCompanies(current => {
          const availableCompanies = companies.filter(c => !failedLogos.has(c.logo))
          if (availableCompanies.length < 3) return current // Keep current if not enough valid logos

          const nextIndex = availableCompanies.findIndex(c => c.name === current[0].name) + 1
          const startIndex = nextIndex >= availableCompanies.length ? 0 : nextIndex
          return availableCompanies.slice(startIndex, startIndex + 3).concat(
            startIndex + 3 > availableCompanies.length ? availableCompanies.slice(0, 3 - (availableCompanies.length - startIndex)) : []
          )
        })
        setIsAnimating(false)
      }, 600)
    }, 4000)

    return () => clearInterval(interval)
  }, [failedLogos])

  const handleImageError = (logo: string) => {
    setFailedLogos(prev => new Set([...prev, logo]))
  }

  return (
    <div className="mt-12 flex flex-col items-center justify-center gap-4">
      <p className="text-center text-sm text-muted-foreground">
        Trusted by job seekers applying to top companies worldwide
      </p>
      <div className="flex items-center justify-center gap-12">
        <AnimatePresence mode="wait">
          {visibleCompanies.map((company) => (
            <motion.div
              key={company.name}
              className="relative h-12 w-24"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isAnimating ? 0 : 1, y: isAnimating ? 20 : 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src={company.logo}
                alt={company.name}
                className="object-contain dark:invert"
                fill
                onError={() => handleImageError(company.logo)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
