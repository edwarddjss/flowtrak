"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Application } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"
import { ApplicationDialog } from "@/components/application-dialog"

export default function ApplicationPage({ params }: { params: { id: string } }) {
  const [application, setApplication] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data, error: supabaseError } = await supabase
          .from('applications')
          .select('*')
          .eq('id', params.id)
          .single()

        if (supabaseError) {
          throw new Error(supabaseError.message)
        }

        if (!data) {
          throw new Error('Application not found')
        }

        setApplication(data)
      } catch (err) {
        console.error('Error fetching application:', err)
        setError(err instanceof Error ? err.message : 'Failed to load application')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchApplication()
    }
  }, [params.id, supabase])

  const handleRefresh = async () => {
    if (!application) return []
    
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error
      if (data) {
        setApplication(data)
        return [data]
      }
      return []
    } catch (err) {
      console.error('Error refreshing application:', err)
      return []
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6 max-w-7xl space-y-4">
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

  if (error) {
    return (
      <div className="container mx-auto py-6 max-w-7xl">
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-destructive">{error}</p>
            <button 
              onClick={() => router.push('/dashboard/applications')}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Return to Applications
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!application) {
    return null
  }

  return (
    <div className="container mx-auto py-6 max-w-7xl space-y-8">
      <Card className="p-0 overflow-hidden">
        <ApplicationDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          mode="edit"
          initialData={application}
          onSuccess={handleRefresh}
        />
      </Card>
    </div>
  )
}
