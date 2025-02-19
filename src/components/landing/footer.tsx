'use client'

import Link from 'next/link'
import { Github } from 'lucide-react'

const links = [
  { title: 'Features', href: '#features' },
  { title: 'Dashboard', href: '#dashboard' },
  { title: 'Chrome Extension', href: '#chrome-extension' },
  { title: 'Pricing', href: '#pricing' },
  { title: 'Blog', href: '/blog' },
  { title: 'Documentation', href: '/docs' },
  { title: 'Support', href: '/support' }
]

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col md:flex-row justify-between items-center gap-4 py-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-sm font-medium">
            flowtrak
          </Link>
          {links.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.title}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/edwarddjss/flowtrak"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground"
          >
            <Github className="h-4 w-4" />
            <span className="sr-only">GitHub</span>
          </Link>
          <span className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} FlowTrak
          </span>
        </div>
      </div>
    </footer>
  )
}
