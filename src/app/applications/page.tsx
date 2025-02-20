'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { ApplicationDialog } from '@/components/application-dialog'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from 'lucide-react'
import type { Application } from '@/types'

export default function EditApplicationPage({
  params,
}: {
  params: { id: string }
}) {
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(true)
  const [application, setApplication] = useState<Application | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const refreshApplication = async () => {
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
    
      if (data) {
        setApplication(data)
        setOpen(false)
        return [data]
      } else {
        throw new Error('Application not found')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load application')
      return []
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (params.id) {
      refreshApplication()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-6 max-w-7xl">
        <Card className="p-6">
          <p className="text-destructive">{error}</p>
          <button 
            onClick={() => router.push('/applications')}
            className="mt-4 text-sm text-muted-foreground hover:text-foreground"
          >
            Return to Applications
          </button>
        </Card>
      </div>
    )
  }

  if (!application) {
    return null
  }

  return (
    <div className="container mx-auto py-6 max-w-7xl space-y-8">
      <Tabs defaultValue="details" className="w-full">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <Card className="p-0 overflow-hidden">
            <ApplicationDialog
              open={open}
              onOpenChange={setOpen}
              mode="edit"
              initialData={application}
              onSuccess={refreshApplication}
            />
          </Card>
        </TabsContent>
        
        <TabsContent value="notes">
          <Card className="p-6">
            <p className="text-sm text-muted-foreground">
              {application.notes || 'No notes added yet.'}
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
