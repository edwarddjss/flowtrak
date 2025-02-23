'use client'

import { ApplicationsTable } from '@/components/applications-table'
import { DashboardContent } from '@/components/dashboard-content'

export default function ApplicationsPage() {
  return (
    <DashboardContent
      heading="Applications"
      description="Manage and track your job applications."
    >
      <div className="grid gap-8">
        <ApplicationsTable />
      </div>
    </DashboardContent>
  )
}
