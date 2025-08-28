'use client'

import React, { useMemo } from 'react'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts'
import { format, startOfWeek, addWeeks, isBefore, parseISO, isValid } from 'date-fns'

interface Application {
  id: string
  user_id: string
  company: string
  position: string
  location?: string
  status: string
  applied_date: string
  created_at: string
  updated_at: string
  interview_date?: string
  notes?: string
}

interface ApplicationTimelineProps {
  applications: Application[]
}

export function ApplicationTimeline({ applications }: ApplicationTimelineProps) {
  const data = useMemo(() => {
    if (!applications.length) return []

    // Sort applications by date
    const sortedApplications = [...applications].sort(
      (a, b) => new Date(a.applied_date).getTime() - new Date(b.applied_date).getTime()
    )

    // Find earliest application date
    const earliestDate = new Date(sortedApplications[0].applied_date)
    const latestDate = new Date()

    // Create weekly data points
    const weeklyData = []
    let currentWeekStart = startOfWeek(earliestDate)

    while (isBefore(currentWeekStart, latestDate)) {
      const nextWeekStart = addWeeks(currentWeekStart, 1)

      // Count applications for this week
      const weeklyApplied = applications.filter(app => {
        const appDate = parseISO(app.applied_date)
        return isValid(appDate) && 
          appDate >= currentWeekStart && 
          appDate < nextWeekStart
      }).length

      // Count responses received this week (interviews, offers, rejections)
      const weeklyResponses = applications.filter(app => {
        // Count based on updated_at date as a proxy for status updates
        const responseDate = parseISO(app.updated_at)
        
        return responseDate && 
          isValid(responseDate) && 
          responseDate >= currentWeekStart && 
          responseDate < nextWeekStart && 
          ['interviewing', 'offer', 'rejected'].includes(app.status)
      }).length

      weeklyData.push({
        week: format(currentWeekStart, 'MMM d'),
        applications: weeklyApplied,
        responses: weeklyResponses
      })

      currentWeekStart = nextWeekStart
    }

    return weeklyData
  }, [applications])

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <defs>
          <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorResponses" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis 
          dataKey="week" 
          tickLine={false}
          axisLine={{ stroke: 'hsl(var(--border))' }}
          tick={{ fill: 'hsl(var(--muted-foreground))' }}
          dy={10}
        />
        <YAxis 
          tickLine={false}
          axisLine={false}
          tick={{ fill: 'hsl(var(--muted-foreground))' }}
          width={40}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'hsl(var(--popover))',
            borderColor: 'hsl(var(--border))',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
          itemStyle={{ color: 'hsl(var(--foreground))' }}
          formatter={(value: number, name: string) => [
            `${value} ${name.toLowerCase()}`,
            name === 'Applications' ? 'Submitted' : 'Received'
          ]}
        />
        <Legend 
          wrapperStyle={{ paddingTop: '10px' }}
          formatter={(value: string) => (
            <span style={{ color: 'hsl(var(--foreground))' }}>{value}</span>
          )}
        />
        <Area
          type="monotone"
          dataKey="applications"
          stroke="#3b82f6"
          fillOpacity={1}
          fill="url(#colorApplications)"
          activeDot={{ r: 6 }}
          name="Applications"
        />
        <Area
          type="monotone"
          dataKey="responses"
          stroke="#8b5cf6"
          fillOpacity={1}
          fill="url(#colorResponses)"
          activeDot={{ r: 6 }}
          name="Responses"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
} 