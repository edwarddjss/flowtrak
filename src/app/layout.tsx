import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { Toaster } from 'sonner'
import { QueryProvider } from '../components/query-provider'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { SessionProvider } from '../components/providers'
import { ThemeProvider } from '@/components/theme-provider'
import { ChatBot } from '../components/chat-bot' // Assuming ChatBot is located in this file
import './globals.css'
import '../styles/animations.css'

const geist = GeistSans

export const metadata: Metadata = {
  title: {
    template: '%s | FlowTrak',
    default: 'FlowTrak - Track Your Job Applications'
  },
  description: 'Track your job applications and career journey with FlowTrak. Visualize your progress, manage applications, and stay organized in your job search.',
  keywords: ['job tracking', 'career management', 'application tracker', 'job search'],
  authors: [{ name: 'FlowTrak' }],
  creator: 'FlowTrak',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://flowtrak.vercel.app',
    title: 'FlowTrak - Track Your Job Applications',
    description: 'Track your job applications and career journey with FlowTrak',
    siteName: 'FlowTrak'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FlowTrak - Track Your Job Applications',
    description: 'Track your job applications and career journey with FlowTrak'
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ],
  width: 'device-width',
  initialScale: 1
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={geist.className}>
      <body className="min-h-screen bg-background">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <QueryProvider>
              {children}
              <ChatBot />
              <Toaster />
              <Analytics />
              <SpeedInsights />
            </QueryProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
