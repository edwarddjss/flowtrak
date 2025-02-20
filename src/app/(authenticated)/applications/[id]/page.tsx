'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { ApplicationDialog } from '@/components/application-dialog'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain } from 'lucide-react'
import type { Application } from '@/types'

export default function EditApplicationPage({
  params,
}: {
  params: { id: string }
}) {
  const [open, setOpen] = useState(true)
  const [application, setApplication] = useState<Application | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const refreshApplication = async () => {
    const { data } = await supabase
      .from('applications')
      .select('*')
      .eq('id', params.id)
      .single()
    
    if (data) {
      setApplication(data)
    }
    setOpen(false)
    return data ? [data] : []
  }

  useEffect(() => {
    refreshApplication()
  }, [params.id])

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
          {/* Notes content */}
        </TabsContent>
      </Tabs>
    </div>
  )
}
