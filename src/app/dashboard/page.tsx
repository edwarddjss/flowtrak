import { Card } from '@/components/ui/card'
import { InternshipSankey } from '@/components/InternshipSankey'
import { ApplicationsTable } from '@/components/applications-table'
import { ApplicationDialog } from '@/components/application-dialog'
import { 
  BarChart2, 
  Briefcase, 
  Calendar, 
  Clock, 
  TrendingUp, 
  Zap, 
  Target, 
  Award, 
  Calendar as CalendarIcon,
  List,
  PieChart,
  Plus,
  CalendarClock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Suspense } from 'react'
import { TableSkeleton } from '@/components/ui/table-skeleton'
import { createClient } from '@/lib/supabase/server'
import { EmptyState } from '@/components/empty-state'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StatusChart } from '@/components/status-chart'
import { ApplicationTimeline } from '@/components/application-timeline'
import Link from 'next/link'
import { redirect } from 'next/navigation'

// Prevent static generation
export const dynamic = 'force-dynamic'

async function getApplications() {
  const supabase = createClient()
  
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  
  if (authError || !user) {
    redirect('/auth/signin')
  }

  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching applications:', error)
    return []
  }

  return data || []
}

export default async function DashboardPage() {
  const applications = await getApplications()
  const hasApplications = applications.length > 0

  const stats = (() => {
    if (!hasApplications) {
      return {
        totalApplications: 0,
        recentApplications: 0,
        responseRate: '0.0',
        avgDays: 0,
        inProgress: 0,
        successRate: '0.0',
        interviewConversionRate: '0.0',
        upcomingInterviews: 0
      }
    }

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

    const responseRate = (((statusCounts.interviewing || 0) + 
      (statusCounts.offer || 0) + 
      (statusCounts.rejected || 0)) / totalApplications * 100).toFixed(1)

    const successRate = (((statusCounts.offer || 0) + 
      (statusCounts.accepted || 0)) / totalApplications * 100).toFixed(1)

    const inProgress = (statusCounts.applied || 0) + (statusCounts.interviewing || 0)

    const averageTimeToResponse = applications
      .filter(app => app.interview_date)
      .reduce((sum, app) => {
        const appliedDate = new Date(app.applied_date)
        const interviewDate = new Date(app.interview_date!)
        return sum + (interviewDate.getTime() - appliedDate.getTime())
      }, 0) / (applications.filter(app => app.interview_date).length || 1)

    const avgDays = Math.round(averageTimeToResponse / (1000 * 60 * 60 * 24))

    // Calculate interview conversion rate
    const interviewCount = statusCounts.interviewing || 0 + (statusCounts.offer || 0) + (statusCounts.accepted || 0)
    const interviewConversionRate = ((interviewCount / totalApplications) * 100).toFixed(1)

    // Count upcoming interviews
    const today = new Date()
    const upcomingInterviews = applications.filter(app => 
      app.interview_date && new Date(app.interview_date) > today
    ).length

    return {
      totalApplications,
      recentApplications,
      responseRate,
      avgDays,
      inProgress,
      successRate,
      interviewConversionRate,
      upcomingInterviews
    }
  })()

  return (
    <div className="h-full flex flex-col bg-background bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-background via-background to-muted/20">
      <div className="flex-none px-6 py-4 border-b backdrop-blur-sm bg-background/90 sticky top-0 z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Track and optimize your job search progress
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/applications">
              <Button variant="outline" className="shadow-sm hover:shadow transition-all" size="lg">
                <List className="mr-2 h-4 w-4" />
                View All
              </Button>
            </Link>
            <ApplicationDialog
              mode="create"
              trigger={
                <Button className="shadow-md hover:shadow-lg transition-all" size="lg">
                  <Plus className="mr-2 h-4 w-4" />
                  Apply Now
                </Button>
              }
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6 hover:shadow-md transition-all hover:-translate-y-0.5 border-l-4 border-l-blue-500">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Briefcase className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Applications</p>
                  <p className="text-2xl font-bold">{stats.totalApplications}</p>
                </div>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center text-green-500 mr-2">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stats.recentApplications}
                </span>
                in the last 30 days
              </div>
            </Card>
            
            <Card className="p-6 hover:shadow-md transition-all hover:-translate-y-0.5 border-l-4 border-l-purple-500">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <CalendarClock className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Upcoming Interviews</p>
                  <p className="text-2xl font-bold">{stats.upcomingInterviews}</p>
                </div>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center text-amber-500 mr-2">
                  <Clock className="h-3 w-3 mr-1" />
                  Avg. response: {stats.avgDays} days
                </span>
              </div>
            </Card>
            
            <Card className="p-6 hover:shadow-md transition-all hover:-translate-y-0.5 border-l-4 border-l-amber-500">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-500/10 rounded-lg">
                  <Target className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Response Rate</p>
                  <p className="text-2xl font-bold">{stats.responseRate}%</p>
                </div>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center text-violet-500 mr-2">
                  <BarChart2 className="h-3 w-3 mr-1" />
                  {stats.interviewConversionRate}%
                </span>
                interview conversion
              </div>
            </Card>
            
            <Card className="p-6 hover:shadow-md transition-all hover:-translate-y-0.5 border-l-4 border-l-emerald-500">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-500/10 rounded-lg">
                  <Award className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold">{stats.successRate}%</p>
                </div>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center text-green-500 mr-2">
                  <Zap className="h-3 w-3 mr-1" />
                  {stats.inProgress}
                </span>
                applications in progress
              </div>
            </Card>
          </div>

          {hasApplications ? (
            <>
              {/* Top section with two equal-width cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Application Status Distribution */}
                <Card className="p-6 hover:shadow-md transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-semibold flex items-center">
                        <PieChart className="h-5 w-5 mr-2 text-primary/70" />
                        Status Distribution
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Breakdown of applications by current status
                      </p>
                    </div>
                  </div>
                  <div className="h-[250px]">
                    <StatusChart applications={applications} />
                  </div>
                </Card>

                {/* Application Timeline */}
                <Card className="p-6 hover:shadow-md transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-semibold flex items-center">
                        <CalendarIcon className="h-5 w-5 mr-2 text-primary/70" />
                        Application Timeline
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Track your application activity over time
                      </p>
                    </div>
                  </div>
                  <div className="h-[250px]">
                    <ApplicationTimeline applications={applications} />
                  </div>
                </Card>
              </div>

              <Card className="p-6 hover:shadow-md transition-all overflow-hidden bg-card">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold flex items-center">
                      <BarChart2 className="h-5 w-5 mr-2 text-primary/70" />
                      Application Pipeline
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Visualize how your applications progress through each stage
                    </p>
                  </div>
                  <div className="flex items-center mt-3 sm:mt-0">
                    <div className="flex items-center gap-3 text-xs flex-wrap">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span>Applied</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-violet-500"></div>
                        <span>Interviewing</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span>Offer</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span>Rejected</span>
                      </div>
                    </div>
                  </div>
                </div>
                <InternshipSankey applications={applications} />
              </Card>

              <Card className="p-6 hover:shadow-md transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold flex items-center">
                      <List className="h-5 w-5 mr-2 text-primary/70" />
                      Recent Applications
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your most recent job applications
                    </p>
                  </div>
                  <div className="mt-3 sm:mt-0">
                    <Tabs defaultValue="all" className="w-[300px]">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="active">Active</TabsTrigger>
                        <TabsTrigger value="recent">Recent</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
                <Suspense fallback={<TableSkeleton />}>
                  <ApplicationsTable 
                    applications={applications.slice(0, 5)}
                    limitColumns
                    showViewAll
                  />
                </Suspense>
              </Card>
            </>
          ) : (
            <EmptyState
              title="No applications yet"
              description="Get started by adding your first job application."
              action={
                <ApplicationDialog
                  mode="create"
                  trigger={
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Application
                    </Button>
                  }
                />
              }
            />
          )}
        </div>
      </div>
    </div>
  )
}
