'use client'

import { Application } from '@/types'
import { Card } from '@/components/ui/card'
import { ResponsiveCalendar } from '@nivo/calendar'
import { BarChart, Title, Text } from '@tremor/react'
import { format, subMonths } from 'date-fns'

interface AnalyticsContentProps {
  applications: Application[]
}

export function AnalyticsContent({ applications }: AnalyticsContentProps) {
  // Prepare data for the calendar chart
  const calendarData = applications.reduce((acc: any[], app) => {
    const date = format(new Date(app.applied_date), 'yyyy-MM-dd')
    const existingEntry = acc.find((entry) => entry.day === date)
    
    if (existingEntry) {
      existingEntry.value += 1
    } else {
      acc.push({ day: date, value: 1 })
    }
    
    return acc
  }, [])

  // Prepare data for status distribution
  const statusDistribution = applications.reduce((acc: any, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1
    return acc
  }, {})

  const statusData = Object.entries(statusDistribution).map(([name, value]) => ({
    name,
    'Applications': value,
  }))

  // Calculate success metrics
  const totalApplications = applications.length
  const interviewRate = applications.filter(app => app.status === 'interviewing' || app.status === 'accepted').length / totalApplications * 100
  const offerRate = applications.filter(app => app.status === 'accepted').length / totalApplications * 100

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <Title>Application Activity</Title>
          <Text>Your application submissions over time</Text>
          <div className="h-[200px] mt-4">
            <ResponsiveCalendar
              data={calendarData}
              from={subMonths(new Date(), 6).toISOString()}
              to={new Date().toISOString()}
              emptyColor="#eeeeee"
              colors={['#b7e4c7', '#74c69d', '#40916c', '#2d6a4f']}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              yearSpacing={40}
              monthBorderColor="#ffffff"
              dayBorderWidth={2}
              dayBorderColor="#ffffff"
            />
          </div>
        </Card>

        <Card className="p-6">
          <Title>Application Status Distribution</Title>
          <Text>Breakdown of your applications by status</Text>
          <BarChart
            className="mt-4 h-[200px]"
            data={statusData}
            index="name"
            categories={['Applications']}
            colors={['blue']}
            valueFormatter={(value) => `${value} apps`}
          />
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <Title>Interview Success Rate</Title>
          <Text>Percentage of applications that led to interviews</Text>
          <div className="mt-4">
            <div className="text-3xl font-bold text-blue-600">
              {interviewRate.toFixed(1)}%
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {applications.filter(app => app.status === 'interviewing' || app.status === 'accepted').length} out of {totalApplications} applications
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <Title>Offer Success Rate</Title>
          <Text>Percentage of applications that led to offers</Text>
          <div className="mt-4">
            <div className="text-3xl font-bold text-green-600">
              {offerRate.toFixed(1)}%
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {applications.filter(app => app.status === 'accepted').length} out of {totalApplications} applications
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
