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
      }, 600)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center justify-center gap-12">
      <AnimatePresence mode="wait">
        {visibleCompanies.map((company, index) => (
          <motion.div
            key={company.name}
            className="relative h-12 w-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isAnimating ? 0 : 1, y: isAnimating ? 20 : 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Image
              src={company.logo}
              alt={company.name}
              fill
              className="object-contain hover:scale-105 transition-transform rounded-full bg-white/5 p-2"
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
