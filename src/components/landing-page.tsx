'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { DashboardPreview } from "./dashboard-preview"
import { ModeToggle } from "./mode-toggle"
import { ChromeExtensionPromo } from "./chrome-extension-promo"
import { Features } from "./landing/features"
import { Pricing } from "./landing/pricing"
import { Testimonials } from "./landing/testimonials"
import { TrustedBy } from "./landing/trusted-by"
import { Footer } from "./landing/footer"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { CustomAvatar } from './ui/custom-avatar'

export function LandingPage() {
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link 
              href="/" 
              className={cn(
                "font-bold text-transparent bg-clip-text",
                "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
              )}
            >
              flowtrak
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <Link href="#features" className="transition-colors hover:text-foreground/80 text-foreground/60">
                Features
              </Link>
              <Link href="#dashboard" className="transition-colors hover:text-foreground/80 text-foreground/60">
                Demo
              </Link>
              <Link href="#chrome-extension" className="transition-colors hover:text-foreground/80 text-foreground/60">
                Chrome Extension
              </Link>
              <Link href="#pricing" className="transition-colors hover:text-foreground/80 text-foreground/60">
                Pricing
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            {user ? (
              <div className="flex items-center gap-4">
                <CustomAvatar userId={user.id} className="h-8 w-8" />
                <Button asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              </div>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/auth/signin">Log in</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/signin?signup=true">Try for free</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section with Social Proof */}
      <section className="flex flex-col items-center justify-center min-h-[80vh] py-16 px-4 text-center relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full filter blur-3xl animate-pulse delay-700"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500/5 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="max-w-4xl text-4xl md:text-6xl font-bold tracking-tight">
              <span className={cn(
                "text-transparent bg-clip-text",
                "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
              )}>
                flowtrak
              </span>{" "}
              helps you manage your job search journey
            </h1>
            <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 text-2xl md:text-3xl font-semibold tracking-tight">
              <motion.span 
                className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-600"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0 }}
              >
                Track
              </motion.span>
              <span className="hidden md:inline text-muted-foreground">•</span>
              <motion.span 
                className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-purple-600"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
              >
                Prepare
              </motion.span>
              <span className="hidden md:inline text-muted-foreground">•</span>
              <motion.span 
                className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-pink-600"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1.4 }}
              >
                Succeed
              </motion.span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/auth/signin?signup=true&redirect=/onboarding">Get started for free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#features">See how it works</Link>
            </Button>
          </div>

          {/* Trusted Companies */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-4">
              Trusted by job seekers from top companies
            </p>
            <div className="w-full max-w-2xl mx-auto">
              <TrustedBy />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4">
        <Features />
      </section>

      {/* Dashboard Demo Section */}
      <section id="dashboard" className="py-16 px-4 bg-muted/50">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Beautiful Dashboard Experience</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Track your applications with a modern, intuitive interface. Get insights and visualizations to optimize your job search.
            </p>
          </div>
          <div className="rounded-lg border bg-background shadow-xl overflow-hidden">
            <DashboardPreview />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-4">
        <Pricing />
      </section>

      {/* Chrome Extension Section */}
      <section id="chrome-extension" className="py-16 px-4 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Seamless Integration</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Track applications directly from job boards with our Chrome extension. No more manual data entry.
            </p>
          </div>
          <ChromeExtensionPromo />
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 px-4">
        <Testimonials />
      </section>

      <Footer />
    </div>
  )
}
