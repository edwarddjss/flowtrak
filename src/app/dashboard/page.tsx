'use client'

import { Card } from '@/components/ui/card'
import { InternshipSankey } from '@/components/InternshipSankey'
import { useApplications } from '@/lib/hooks/use-applications'
import { ApplicationsTable } from '@/components/applications-table'
import { ApplicationDialog } from '@/components/application-dialog'
import { deleteApplicationAction } from '@/app/client-actions'
import { useMemo } from 'react'
import { BarChart2, Briefcase, Calendar, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Suspense } from 'react'
import { TableSkeleton } from '@/components/ui/table-skeleton'

export default function DashboardPage() {
  const { applications, isLoading, refreshApplications } = useApplications()

  const stats = useMemo(() => {
    if (!applications?.length) return null

    const totalApplications = applications.length
    const lastMonthDate = new Date()
    lastMonthDate.setMonth(lastMonthDate.getMonth() - 1)
    
    const recentApplications = applications.filter(
      app => new Date(app.created_at) > lastMonthDate
    ).length

    const statusCounts = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const responseRate = (((statusCounts.interview || 0) + 
      (statusCounts.offer || 0) + 
      (statusCounts.rejected || 0)) / totalApplications * 100).toFixed(1)

    const averageTimeToResponse = applications
      .filter(app => app.interview_date)
      .reduce((sum, app) => {
        const appliedDate = new Date(app.applied_date)
        const interviewDate = new Date(app.interview_date!)
        return sum + (interviewDate.getTime() - appliedDate.getTime())
      }, 0) / (applications.filter(app => app.interview_date).length || 1)

    const avgDays = Math.round(averageTimeToResponse / (1000 * 60 * 60 * 24))

    return {
      totalApplications,
      recentApplications,
      responseRate,
      avgDays
    }
  }, [applications])

  return (
    <div className="h-full flex flex-col">
      <div className="flex-none px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Track and optimize your job search progress
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ApplicationDialog
              mode="create"
              trigger={
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Application
                </Button>
              }
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {stats && (
            <div className="grid grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Briefcase className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Applications</p>
                    <p className="text-2xl font-bold">{stats.totalApplications}</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <Calendar className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last 30 Days</p>
                    <p className="text-2xl font-bold">{stats.recentApplications}</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-500/10 rounded-lg">
                    <BarChart2 className="h-4 w-4 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Response Rate</p>
                    <p className="text-2xl font-bold">{stats.responseRate}%</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Clock className="h-4 w-4 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Response Time</p>
                    <p className="text-2xl font-bold">{stats.avgDays} days</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Application Flow</h2>
            <InternshipSankey applications={applications} isLoading={isLoading} />
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Applications</h2>
            <Suspense fallback={<TableSkeleton />}>
              <ApplicationsTable 
                applications={applications}
                onDelete={async (id) => {
                  await deleteApplicationAction(id)
                  refreshApplications()
                }}
                onUpdate={refreshApplications}
              />
            </Suspense>
          </Card>
        </div>
      </div>
    </div>
  )
}
