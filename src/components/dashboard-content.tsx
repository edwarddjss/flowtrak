'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Application } from '@/types'
import { AddApplicationDialog } from './add-application-dialog'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useMediaQuery } from '@/lib/hooks/use-media-query'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ApplicationsTable } from './applications-table'
import { InternshipSankey } from './InternshipSankey'
import { RecentActivity } from './recent-activity'
import { refreshApplicationsAction, deleteApplicationAction } from '@/app/actions'

export default function DashboardContent() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadApplications = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await refreshApplicationsAction()
      setApplications(data)
    } catch (error) {
      console.error('Error loading applications:', error)
      setError('Failed to load applications. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadApplications()
  }, [])

  const handleAddSuccess = async () => {
    setLoading(true)
    try {
      const data = await refreshApplicationsAction()
      setApplications(data)
    } catch (error) {
      console.error('Error refreshing applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteApplication = async (id: string) => {
    try {
      await deleteApplicationAction(id)
      await loadApplications()
    } catch (error) {
      console.error('Error deleting application:', error)
      setError('Failed to delete application. Please try again.')
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-none px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Track and optimize your job search progress
            </p>
          </div>
          <div className="flex items-center gap-4">
            <AddApplicationDialog onSuccess={handleAddSuccess} />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Application Flow</h2>
            <InternshipSankey applications={applications} isLoading={loading} />
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Applications</h2>
            <ApplicationsTable
              applications={applications}
              isLoading={loading}
              onDelete={handleDeleteApplication}
              onUpdate={loadApplications}
            />
          </Card>
        </div>
      </div>
    </div>
  )
}
