'use client'

import { Card } from "@/components/ui/card"
import { InternshipSankey } from "@/components/InternshipSankey"
import { ApplicationsTable } from "@/components/applications-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

const mockApplications = [
  {
    id: '1',
    company: 'Google',
    position: 'Software Engineer',
    location: 'Mountain View, CA',
    status: 'applied',
    applied_date: '2024-02-15',
    created_at: '2024-02-15',
    user_id: '1'
  },
  {
    id: '2',
    company: 'Microsoft',
    position: 'Software Engineer',
    location: 'Redmond, WA',
    status: 'interview',
    applied_date: '2024-02-14',
    created_at: '2024-02-14',
    user_id: '1'
  },
  {
    id: '3',
    company: 'Amazon',
    position: 'Software Engineer',
    location: 'Seattle, WA',
    status: 'rejected',
    applied_date: '2024-02-13',
    created_at: '2024-02-13',
    user_id: '1'
  }
]

export function DashboardPreview() {
  return (
    <div className="w-full h-full bg-background">
      <div className="flex items-center justify-between p-6 border-b">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Track and optimize your job search progress
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Application
        </Button>
      </div>

      <div className="p-6 space-y-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Application Flow</h2>
          <div className="h-[300px]">
            <InternshipSankey applications={mockApplications} />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Applications</h2>
          <ApplicationsTable 
            applications={mockApplications}
            onDelete={() => {}}
            onUpdate={() => {}}
          />
        </Card>
      </div>
    </div>
  )
}
