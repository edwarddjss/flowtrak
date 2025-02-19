'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { ApplicationDialog } from '@/components/application-dialog'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain } from 'lucide-react'
import dynamic from 'next/dynamic'
import type { Application } from '@/types'

const MockInterview = dynamic(() => import('@/components/mock-interview'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center p-8">
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-full bg-muted h-12 w-12"></div>
        <div className="flex-1 space-y-4 py-1">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default function EditApplicationPage({
  params,
}: {
  params: { id: string }
}) {
  const [open, setOpen] = useState(true)
  const [application, setApplication] = useState<Application | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchApplication = async () => {
      const { data } = await supabase
        .from('applications')
        .select('*')
        .eq('id', params.id)
        .single()
      
      if (data) {
        setApplication(data)
      }
    }
    fetchApplication()
  }, [params.id, supabase])

  // Redirect to applications page when dialog is closed
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      router.push('/dashboard/applications')
    }
    setOpen(open)
  }

  if (!application) {
    return null // or loading state
  }

  return (
    <div className="container mx-auto py-6 max-w-7xl space-y-8">
      <Tabs defaultValue="details" className="w-full">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="interview" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Mock Interview
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <Card className="p-0 overflow-hidden">
            <ApplicationDialog
              open={open}
              onOpenChange={handleOpenChange}
              mode="edit"
              initialData={application}
              onSuccess={() => {
                handleOpenChange(false)
              }}
            />
          </Card>
        </TabsContent>
        
        <TabsContent value="notes">
          {/* Notes content */}
        </TabsContent>

        <TabsContent value="interview" className="mt-6">
          <MockInterview 
            position={application.position}
            company={application.company}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
