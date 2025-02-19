"use client"

import * as React from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { FileText, BarChart, Building2, Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface OverviewProps {
  userId: string
}

export function Overview({ userId }: OverviewProps) {
  const supabase = createClientComponentClient()
  const [stats, setStats] = React.useState({
    totalApplications: 0,
    interviewRate: 0,
    uniqueCompanies: 0,
    activeApplications: 0,
  })
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchStats() {
      try {
        const { data: applications, error } = await supabase
          .from('applications')
          .select('*')
          .eq('user_id', userId)

        if (error) throw error

        const totalApplications = applications.length
        const interviewingCount = applications.filter(app => app.status === 'interviewing').length
        const interviewRate = totalApplications > 0 ? (interviewingCount / totalApplications) * 100 : 0
        const uniqueCompanies = new Set(applications.map(app => app.company)).size
        const activeApplications = applications.filter(app => 
          ['applied', 'interviewing', 'offer'].includes(app.status)
        ).length

        setStats({
          totalApplications,
          interviewRate,
          uniqueCompanies,
          activeApplications,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [supabase, userId])

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-7 w-20" />
          ) : (
            <>
              <div className="text-2xl font-bold">{stats.totalApplications}</div>
              <p className="text-xs text-muted-foreground">
                applications tracked
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Interview Rate</CardTitle>
          <BarChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-7 w-20" />
          ) : (
            <>
              <div className="text-2xl font-bold">
                {stats.interviewRate.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                of applications reached interviews
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Unique Companies</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-7 w-20" />
          ) : (
            <>
              <div className="text-2xl font-bold">{stats.uniqueCompanies}</div>
              <p className="text-xs text-muted-foreground">
                different companies applied to
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Applications</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-7 w-20" />
          ) : (
            <>
              <div className="text-2xl font-bold">{stats.activeApplications}</div>
              <p className="text-xs text-muted-foreground">
                applications in progress
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </>
  )
}
