'use client'

import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import { ApplicationsChart } from '@/components/analytics/applications-chart'
import { ApplicationsStats } from '@/components/analytics/applications-stats'

export default function AnalyticsPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Analytics"
        text="View insights about your job applications."
      />
      <div className="grid gap-8">
        <ApplicationsStats />
        <ApplicationsChart />
      </div>
    </DashboardShell>
  )
}
