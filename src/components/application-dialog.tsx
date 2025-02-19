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
}

export function ApplicationDialog({ 
  trigger, 
  initialData,
  mode = 'create'
}: ApplicationDialogProps) {
  const [open, setOpen] = React.useState(false)

  const processedInitialData: (Partial<FormValues> & { id?: string }) | undefined = initialData
    ? {
        company: initialData.company,
        position: initialData.position,
        location: initialData.location,
        status: initialData.status,
        applied_date: initialData.applied_date ? new Date(initialData.applied_date) : new Date(),
        salary: initialData.salary?.toString(),
        notes: initialData.notes ?? undefined,
        link: initialData.link ?? undefined,
        id: initialData.id,
      }
    : undefined

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            {mode === 'create' ? 'Add Application' : 'Edit Application'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Add New Application' : 'Edit Application'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Add a new job application to track.'
              : 'Edit the details of your job application.'}
          </DialogDescription>
        </DialogHeader>
        <ApplicationForm
          initialData={processedInitialData}
          mode={mode}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
