import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { ThemeProvider } from '@/components/theme-provider'
import { Providers } from '@/components/providers'
import { ErrorBoundary } from '@/components/error-boundary'
import './globals.css'

const geist = GeistSans

export const metadata: Metadata = {
  title: {
    template: '%s | FlowTrak',
    default: 'FlowTrak - Job Application Tracking'
  },
  description: 'Track and manage your job applications efficiently',
  keywords: ['job tracking', 'career management', 'application tracker', 'job search'],
  authors: [{ name: 'FlowTrak' }],
  creator: 'FlowTrak',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://flowtrak.app',
    title: 'FlowTrak - Track Your Job Applications',
    description: 'Track your job applications and career journey with FlowTrak',
    siteName: 'FlowTrak'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FlowTrak - Track Your Job Applications',
    description: 'Track your job applications and career journey with FlowTrak'
  },
  metadataBase: new URL('https://flowtrak.app'),
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
    <html lang="en" suppressHydrationWarning>
      <body className={geist.className}>
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Providers>
              {children}
            </Providers>
          </ThemeProvider>
        </ErrorBoundary>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
