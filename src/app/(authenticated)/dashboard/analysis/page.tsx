'use client'

import { Card } from '@/components/ui/card'

export default function AnalysisPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Job Analysis</h1>
      <p className="text-muted-foreground mt-2">
        Get insights on companies and job descriptions
      </p>
      <div className="mt-8 grid gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
          <p className="text-muted-foreground">
            We&apos;re working on bringing you powerful AI-driven job analysis tools. Stay tuned!
          </p>
        </Card>
      </div>
    </div>
  )
}
