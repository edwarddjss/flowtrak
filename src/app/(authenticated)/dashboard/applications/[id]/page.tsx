"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Application } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ApplicationPage({ params }: { params: { id: string } }) {
  const [application, setApplication] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApplication = async () => {
      const supabase = createClientComponentClient()
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('id', params.id)
        .single()

      if (!error && data) {
        setApplication(data)
      }
      setLoading(false)
    }

    fetchApplication()
  }, [params.id])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[150px]" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[60%]" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-muted-foreground">Application not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{application.company}</h1>
        <div className={`px-3 py-1 rounded-full text-sm ${
          application.status === 'applied' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' :
          application.status === 'interviewing' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300' :
          application.status === 'offer' ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300' :
          application.status === 'rejected' ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' :
          'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
        }`}>
          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Application Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="font-medium">Position</div>
            <div className="text-muted-foreground">{application.position}</div>
          </div>
          <div>
            <div className="font-medium">Applied Date</div>
            <div className="text-muted-foreground">
              {new Date(application.applied_date).toLocaleDateString()}
            </div>
          </div>
          {application.location && (
            <div>
              <div className="font-medium">Location</div>
              <div className="text-muted-foreground">{application.location}</div>
            </div>
          )}
          {application.notes && (
            <div>
              <div className="font-medium">Notes</div>
              <div className="text-muted-foreground whitespace-pre-wrap">{application.notes}</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
