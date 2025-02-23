'use client'

import { DashboardContent } from '@/components/dashboard-content'
import { AnalyticsContent } from '@/components/analytics-content'

export default function AnalyticsPage() {
  return (
    <DashboardContent
      heading="Analytics"
      description="View insights about your job applications."
    >
      <div className="grid gap-8">
        <AnalyticsContent />
      </div>
    </DashboardContent>
  )
}
