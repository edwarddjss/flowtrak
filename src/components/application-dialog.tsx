'use client'

import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { ApplicationForm } from './application-form'
import { Button } from './ui/button'
import type { Application } from '@/types'

interface FormValues {
  company: string
  position: string
  location: string
  status: 'applied' | 'interviewing' | 'offer' | 'accepted' | 'rejected'
  applied_date: Date
  salary?: string
  notes?: string
  link?: string
}

interface ApplicationDialogProps {
  trigger?: React.ReactNode
  initialData?: Partial<Application>
  mode?: 'create' | 'edit'
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSuccess?: () => Promise<Application[]>
}

export function ApplicationDialog({ 
  trigger, 
  initialData,
  mode = 'create',
  open,
  onOpenChange,
  onSuccess,
}: ApplicationDialogProps) {
  const [dialogOpen, setDialogOpen] = React.useState(open ?? false)

  React.useEffect(() => {
    if (open !== undefined) {
      setDialogOpen(open)
    }
  }, [open])

  const handleOpenChange = (newOpen: boolean) => {
    setDialogOpen(newOpen)
    onOpenChange?.(newOpen)
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Add Application' : 'Edit Application'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Add a new job application to track.'
              : 'Update the details of your job application.'}
          </DialogDescription>
        </DialogHeader>
        <ApplicationForm
          initialData={initialData}
          mode={mode}
          onSuccess={() => {
            handleOpenChange(false)
            onSuccess?.()
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
