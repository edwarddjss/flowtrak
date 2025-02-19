'use client'

import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react'

interface Activity {
  id: string
  type: 'success' | 'info' | 'warning'
  message: string
  timestamp: string
}

interface RecentActivityProps {
  limit?: number
}

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'success',
    message: 'Resume uploaded successfully',
    timestamp: '2 min ago'
  },
  {
    id: '2',
    type: 'info',
    message: 'Started company research',
    timestamp: '5 min ago'
  },
  {
    id: '3',
    type: 'success',
    message: 'Completed mock interview',
    timestamp: '10 min ago'
  },
  {
    id: '4',
    type: 'warning',
    message: 'LinkedIn profile sync pending',
    timestamp: '15 min ago'
  },
  {
    id: '5',
    type: 'info',
    message: 'Updated target job preferences',
    timestamp: '20 min ago'
  }
]

export function RecentActivity({ limit = 5 }: RecentActivityProps) {
  const { theme } = useTheme()
  const activities = mockActivities.slice(0, limit)

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className={cn(
            "flex items-start gap-4 rounded-lg p-3",
            "transition-colors duration-200",
            theme === 'dark' ? 'hover:bg-muted/10' : 'hover:bg-muted/60'
          )}
        >
          <div className={cn(
            "rounded-full p-1",
            activity.type === 'success' && 'text-emerald-500 bg-emerald-500/10',
            activity.type === 'info' && 'text-blue-500 bg-blue-500/10',
            activity.type === 'warning' && 'text-amber-500 bg-amber-500/10'
          )}>
            {activity.type === 'success' && <CheckCircle2 className="h-4 w-4" />}
            {activity.type === 'info' && <Clock className="h-4 w-4" />}
            {activity.type === 'warning' && <AlertCircle className="h-4 w-4" />}
          </div>

          <div className="flex-1 space-y-1">
            <p className="text-sm">{activity.message}</p>
            <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
          </div>
        </div>
      ))}

      {activities.length === 0 && (
        <div className="text-center py-6">
          <p className="text-sm text-muted-foreground">No recent activity</p>
        </div>
      )}
    </div>
  )
}
