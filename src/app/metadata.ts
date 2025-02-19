import { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: 'FlowtTrak - Application Tracking',
  description: 'Track your job applications with AI-powered insights',
}
