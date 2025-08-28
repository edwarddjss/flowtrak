'use client'

import React, { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

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

interface StatusChartProps {
  applications: Application[]
}

export function StatusChart({ applications }: StatusChartProps) {
  const data = useMemo(() => {
    // Count applications by status
    const statusCounts = applications.reduce((acc, app) => {
      const status = app.status.charAt(0).toUpperCase() + app.status.slice(1)
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Convert to array format for recharts
    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count
    }))
  }, [applications])

  // Colors for different statuses
  const COLORS = {
    Applied: '#3b82f6', // blue
    Interviewing: '#8b5cf6', // violet
    Rejected: '#ef4444', // red
    Offer: '#10b981', // emerald
    Accepted: '#22c55e', // green
    Declined: '#f97316', // orange
  }

  // Default color if status doesn't match predefined colors
  const defaultColor = '#94a3b8'

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={({ name, percent }: { name: string; percent: number }) => 
            `${name}: ${(percent * 100).toFixed(0)}%`
          }
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={COLORS[entry.name as keyof typeof COLORS] || defaultColor} 
            />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: number, name: string) => [
            `${value} applications`, 
            name
          ]}
          contentStyle={{ 
            backgroundColor: 'hsl(var(--popover))',
            borderColor: 'hsl(var(--border))',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
          itemStyle={{ color: 'hsl(var(--foreground))' }}
        />
        <Legend 
          layout="horizontal" 
          verticalAlign="bottom" 
          align="center"
          formatter={(value: string) => (
            <span style={{ color: 'hsl(var(--foreground))' }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  )
} 