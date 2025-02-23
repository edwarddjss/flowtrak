'use client'

import { ApplicationsDataTable } from '@/components/applications/applications-data-table'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'

export default function ApplicationsPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Applications"
        text="Manage and track your job applications."
      />
      <div className="grid gap-8">
        <ApplicationsDataTable />
      </div>
    </DashboardShell>
  )
}
