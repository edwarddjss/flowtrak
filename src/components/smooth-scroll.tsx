'use client'

import { useEffect } from 'react'
import { useMediaQuery } from '@/hooks/use-media-query'

interface SmoothScrollProps {
  children: React.ReactNode
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const isMobile = useMediaQuery('(max-width: 768px)')
  
  useEffect(() => {
    async function initLenis() {
      const Lenis = (await import('lenis')).default
      const lenis = new Lenis({
        duration: isMobile ? 0.8 : 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        wheelMultiplier: isMobile ? 1 : 0.8,
        touchMultiplier: isMobile ? 1.5 : 2,
      })

      function raf(time: number) {
        lenis.raf(time)
        requestAnimationFrame(raf)
      }

      requestAnimationFrame(raf)

      return () => {
        lenis.destroy()
      }
    }

    const cleanup = initLenis()
    return () => {
      cleanup.then(cleanupFn => cleanupFn())
    }
  }, [isMobile])

  useEffect(() => {
    if (!isMobile) return

    const sections = document.querySelectorAll('section')
    let isScrolling = false
    let currentSection = 0
    let startY = 0
    let startTime = 0

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY
      startTime = Date.now()
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (isScrolling) return

      const endY = e.changedTouches[0].clientY
      const deltaY = startY - endY
      const deltaTime = Date.now() - startTime
      const velocity = Math.abs(deltaY) / deltaTime
      const threshold = window.innerHeight * (velocity > 0.5 ? 0.1 : 0.2) // Dynamic threshold based on velocity

      if (Math.abs(deltaY) < threshold) return

      isScrolling = true
      
      if (deltaY > 0 && currentSection < sections.length - 1) {
        currentSection++
      } else if (deltaY < 0 && currentSection > 0) {
        currentSection--
      }

      const targetSection = sections[currentSection]
      const targetOffset = targetSection.getBoundingClientRect().top + window.scrollY

      window.scrollTo({
        top: targetOffset,
        behavior: 'smooth'
      })

      setTimeout(() => {
        isScrolling = false
      }, 800) // Reduced from 1000ms for snappier response
    }

    const handleWheel = (e: WheelEvent) => {
      if (isScrolling) {
        e.preventDefault()
        return
      }

      const deltaY = e.deltaY
      const threshold = 50 // Wheel threshold

      if (Math.abs(deltaY) < threshold) return

      isScrolling = true
      
      if (deltaY > 0 && currentSection < sections.length - 1) {
        currentSection++
      } else if (deltaY < 0 && currentSection > 0) {
        currentSection--
      }

      const targetSection = sections[currentSection]
      const targetOffset = targetSection.getBoundingClientRect().top + window.scrollY

      window.scrollTo({
        top: targetOffset,
        behavior: 'smooth'
      })

      setTimeout(() => {
        isScrolling = false
      }, 800)
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchend', handleTouchEnd, { passive: false })
    document.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)
      document.removeEventListener('wheel', handleWheel)
    }
  }, [isMobile])

  return <>{children}</>
}
