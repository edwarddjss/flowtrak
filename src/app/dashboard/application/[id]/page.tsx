'use client'

import { useQuery } from "@tanstack/react-query"
import { createClient } from "@supabase/supabase-js"
import { useUser } from "@/hooks/use-user"
import { Application } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from 'next/navigation'
import { ApplicationDialog } from '@/components/application-dialog'
import { useParams } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function ApplicationPage({ params }: { params: { id: string } }) {
  const { user } = useUser()
  const router = useRouter()
  const { data: application, isLoading, error } = useQuery({
    queryKey: ['application', params.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('id', params.id)
        .eq('user_id', user?.id)
        .single()
      
      if (error) throw error
      return data
    },
    enabled: !!user?.id
  })

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      router.push('/dashboard/applications')
    }
  }

  const handleSuccess = async () => {
    // No need to fetch application again, useQuery will refetch automatically
  }

  if (isLoading) {
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
            <p className="text-destructive">{error.message}</p>
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
    return (
      <div className="container mx-auto py-6 max-w-7xl">
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Application not found</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-destructive">Application not found</p>
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

  return (
    <div className="container mx-auto py-6 max-w-7xl space-y-8">
      <Card className="p-0 overflow-hidden">
        <ApplicationDialog
          open={true}
          onOpenChange={handleDialogChange}
          mode="edit"
          initialData={application}
          onSuccess={handleSuccess}
        />
      </Card>
    </div>
  )
}
