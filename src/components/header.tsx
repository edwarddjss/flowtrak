"use client"

import { useState } from "react"
import Link from "next/link"
import { Network, Menu, X } from "lucide-react"
import { Button } from "./ui/button"
import { ThemeToggle } from "./theme-toggle"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <Network className="h-5 w-5" />
            <span className="font-semibold">flowtrak</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium ml-6">
            <Link href="#features" className="transition-colors hover:text-foreground/80">
              Features
            </Link>
            <Link href="#community" className="transition-colors hover:text-foreground/80">
              Advanced Tools
            </Link>
            <Link href="#why" className="transition-colors hover:text-foreground/80">
              Why Flowtrak
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="outline" size="sm" className="hidden md:inline-flex">
            <Link href="/auth/signin">Sign In</Link>
          </Button>
          <Button asChild size="sm" className="hidden md:inline-flex">
            <Link href="/auth/sign-up">Get Started</Link>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden border-b border-border/50">
          <nav className="container flex flex-col space-y-4 py-4">
            <Link href="#features" className="text-sm font-medium transition-colors hover:text-foreground/80">
              Features
            </Link>
            <Link href="#community" className="text-sm font-medium transition-colors hover:text-foreground/80">
              Advanced Tools
            </Link>
            <Link href="#why" className="text-sm font-medium transition-colors hover:text-foreground/80">
              Why Flowtrak
            </Link>
            <Link href="/auth/signin" className="text-sm font-medium transition-colors hover:text-foreground/80">
              Sign In
            </Link>
            <Link href="/auth/sign-up" className="text-sm font-medium transition-colors hover:text-foreground/80">
              Get Started
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
