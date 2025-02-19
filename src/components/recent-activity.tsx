'use client'

import { useEffect, useState } from 'react'
import { Application } from '@/types'
import { refreshApplicationsAction } from '@/app/actions'
import { formatDate } from '@/lib/utils'
import { Badge } from './ui/badge'
import { CompanyAvatar } from './ui/company-avatar'
import Link from 'next/link'
import { Skeleton } from './ui/skeleton'
import { cn } from '@/lib/utils'

interface RecentActivityProps {
  limit?: number
}

export function RecentActivity({ limit = 5 }: RecentActivityProps) {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const data = await refreshApplicationsAction()
        setApplications(data)
      } catch (error) {
        console.error('Error loading applications:', error)
      } finally {
        setLoading(false)
      }
    }
    loadApplications()
  }, [])

  // Sort applications by most recent first and limit to specified number
  const recentApplications = applications
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit)

  const getStatusColor = (status: string) => {
    const colors = {
      applied: 'bg-blue-500',
      interviewing: 'bg-yellow-500',
      offer: 'bg-green-500',
      rejected: 'bg-red-500',
      accepted: 'bg-purple-500'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-500'
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(limit)].map((_, i) => (
          <div key={i} className="flex items-start gap-3 px-2 py-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-3 w-32 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (recentApplications.length === 0) {
    return (
      <div className="text-sm text-muted-foreground px-2">
        No recent activity
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {recentApplications.map((app) => (
        <Link 
          key={app.id} 
          href={`/dashboard/application/${app.id}`}
          className={cn("flex items-start gap-3 px-2 py-2 rounded-lg hover:bg-accent/50 transition-colors", "min-w-0")}
        >
          <CompanyAvatar company={app.company} size="sm" className="shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-medium text-sm truncate">{app.company}</h4>
              <Badge variant="outline" className={cn(getStatusColor(app.status), "shrink-0")}>
                {app.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground truncate">{app.position}</p>
            <p className="text-xs text-muted-foreground">{formatDate(app.created_at)}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}
