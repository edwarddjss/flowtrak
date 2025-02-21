'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const companies = [
  {
    name: 'Google',
    logo: '/logos/google.svg'
  },
  {
    name: 'Microsoft',
    logo: '/logos/microsoft.svg'
  },
  {
    name: 'Meta',
    logo: '/logos/meta.svg'
  },
  {
    name: 'Amazon',
    logo: '/logos/amazon.svg'
  },
  {
    name: 'Apple',
    logo: '/logos/apple.svg'
  },
  {
    name: 'Netflix',
    logo: '/logos/netflix.svg'
  },
  {
    name: 'Uber',
    logo: '/logos/uber.svg'
  },
  {
    name: 'Airbnb',
    logo: '/logos/airbnb.svg'
  },
  {
    name: 'Spotify',
    logo: '/logos/spotify.svg'
  },
  {
    name: 'Stripe',
    logo: '/logos/stripe.svg'
  }
]

export function TrustedBy() {
  const [visibleCompanies, setVisibleCompanies] = useState(companies.slice(0, 3))
  const [isAnimating, setIsAnimating] = useState(false)
  const [imagesLoaded, setImagesLoaded] = useState(false)

  useEffect(() => {
    // Preload all images before starting animation
    const imagePromises = companies.map(company => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = resolve
        img.onerror = reject
        img.src = company.logo
      })
    })

    Promise.all(imagePromises)
      .then(() => setImagesLoaded(true))
      .catch(console.error)
  }, [])

  useEffect(() => {
    if (!imagesLoaded) return

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
  }, [imagesLoaded])

  if (!imagesLoaded) {
    return (
      <div className="mt-12 flex flex-col items-center justify-center gap-4">
        <p className="text-center text-sm text-muted-foreground">
          Trusted by job seekers applying to top companies worldwide
        </p>
        <div className="flex items-center justify-center gap-12">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="relative h-8 w-24 animate-pulse bg-muted rounded" />
          ))}
        </div>
      </div>
    )
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isAnimating ? 0 : 1, y: isAnimating ? 20 : 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="relative h-8 w-24"
            >
              <Image
                src={company.logo}
                alt={`${company.name} logo`}
                fill
                className="object-contain filter dark:invert"
                priority
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
