'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Calendar, Link, MapPin, Building2, DollarSign, FileText, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { useApplications } from '@/lib/hooks/use-applications'
import { EditApplicationDialog } from '@/components/edit-application-dialog'
import type { Application } from '@/types'

const statusColors = {
  applied: 'bg-blue-500',
  interviewing: 'bg-yellow-500',
  offer: 'bg-green-500',
  accepted: 'bg-green-700',
  rejected: 'bg-red-500'
}

export default function ApplicationPage() {
  const params = useParams()
  const { applications } = useApplications()
  const [application, setApplication] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (applications) {
      const app = applications.find((a: Application) => a.id === params.id)
      setApplication(app || null)
      setLoading(false)
    }
  }, [applications, params.id])

  if (loading) {
    return <ApplicationSkeleton />
  }

  if (!application) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <h2 className="text-2xl font-bold">Application Not Found</h2>
        <p className="text-muted-foreground">The application you're looking for doesn't exist.</p>
        <Button variant="outline" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{application.position}</h1>
        <EditApplicationDialog
          trigger={<Button>Edit Application</Button>}
          application={application}
          onSuccess={() => window.location.reload()}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Company Details</h2>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                <span>{application.company}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{application.location}</span>
              </div>
              {application.link && (
                <div className="flex items-center space-x-2">
                  <Link className="w-4 h-4 text-muted-foreground" />
                  <a
                    href={application.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Job Posting
                  </a>
                </div>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Application Status</h2>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>Applied on {format(new Date(application.applied_date), 'PPP')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={statusColors[application.status]}>
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </Badge>
              </div>
              {application.salary && (
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span>{application.salary}</span>
                </div>
              )}
            </div>
          </div>
        </Card>

        {application.notes && (
          <Card className="p-6 space-y-4 md:col-span-2">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Notes</h2>
              <div className="flex items-start space-x-2">
                <FileText className="w-4 h-4 text-muted-foreground mt-1" />
                <p className="whitespace-pre-wrap">{application.notes}</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

function ApplicationSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-10 w-[120px]" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 space-y-4">
          <Skeleton className="h-6 w-[150px]" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <Skeleton className="h-6 w-[150px]" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
          </div>
        </Card>
      </div>
    </div>
  )
}
