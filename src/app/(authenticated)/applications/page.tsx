'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { ApplicationsTable } from '@/components/applications-table'
import { Button } from '@/components/ui/button'
import { ApplicationDialog } from '@/components/application-dialog'
import { PlusIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Application } from '@/types'
import { Input } from '@/components/ui/input'

export default function ApplicationsPage() {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
      }
    }
    getUser()
  }, [supabase.auth])

  const refreshApplications = async () => {
    if (!userId) return []
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('applied_date', { ascending: false })

    if (error) throw error
    const apps = data as Application[]
    setApplications(apps)
    return apps
  }

  const deleteApplication = async (id: string) => {
    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', id)

    if (error) throw error
    return refreshApplications()
  }

  useEffect(() => {
    if (userId) {
      refreshApplications()
    }
  }, [userId])

  if (!userId) return null

  return (
    <div className="container py-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Applications</h1>
        <Button onClick={() => setShowAddDialog(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Application
        </Button>
      </div>

      <Card className="p-0 overflow-hidden">
        <ApplicationsTable 
          applications={applications} 
          refreshAction={refreshApplications}
          deleteAction={deleteApplication}
          isLoading={!userId} 
        />
      </Card>

      <ApplicationDialog 
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSuccess={refreshApplications}
      />
    </div>
  )
}
