'use client'

import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { TrustedBy } from './trusted-by'

export function Hero() {
  return (
    <section className="container flex flex-col items-center pt-24 pb-8 md:pt-32 md:pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex max-w-[980px] flex-col items-center gap-4 text-center"
      >
        <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-6xl lg:text-7xl lg:leading-[1.1]">
          Track, Prepare, Succeed
        </h1>
        <p className="max-w-[600px] text-lg text-muted-foreground sm:text-xl">
          flowtrak helps you manage your job applications, prepare for interviews with AI, and land your dream job. Built for modern job seekers.
        </p>
        <div className="flex gap-4">
          <Link href="/auth/signin">
            <Button size="lg">Get Started Free</Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline">See Features</Button>
          </Link>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <TrustedBy />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="relative w-full max-w-[1200px] mt-16"
      >
        <div className="relative aspect-[16/9] overflow-hidden rounded-lg border bg-muted/50 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-background/0" />
        </div>
      </motion.div>
    </section>
  )
}
