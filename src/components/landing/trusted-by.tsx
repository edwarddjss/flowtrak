'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const companies = [
  {
    name: 'Google',
    domain: 'google.com'
  },
  {
    name: 'Microsoft',
    domain: 'microsoft.com'
  },
  {
    name: 'Meta',
    domain: 'meta.com'
  },
  {
    name: 'Amazon',
    domain: 'amazon.com'
  },
  {
    name: 'Apple',
    domain: 'apple.com'
  },
  {
    name: 'Netflix',
    domain: 'netflix.com'
  },
  {
    name: 'Uber',
    domain: 'uber.com'
  },
  {
    name: 'Airbnb',
    domain: 'airbnb.com'
  },
  {
    name: 'Spotify',
    domain: 'spotify.com'
  },
  {
    name: 'Stripe',
    domain: 'stripe.com'
  }
]

export function TrustedBy() {
  const [visibleCompanies, setVisibleCompanies] = useState(companies.slice(0, 3))
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setVisibleCompanies(current => {
          const nextIndex = companies.findIndex(c => c.name === current[0].name) + 1
          const startIndex = nextIndex >= companies.length ? 0 : nextIndex
          return companies.slice(startIndex, startIndex + 3).concat(
            startIndex + 3 > companies.length ? companies.slice(0, 3 - (companies.length - startIndex)) : []
          )
        })
        setIsAnimating(false)
      }, 400)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isAnimating ? 0 : 1, y: isAnimating ? 20 : 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="relative h-8 w-24"
            >
              <Image
                src={`https://logo.clearbit.com/${company.domain}`}
                alt={`${company.name} logo`}
                fill
                className="object-contain"
                unoptimized
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
