'use client'

import { Application } from '@/lib/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ApplicationForm } from './application-form'
import { useState } from 'react'

interface EditApplicationDialogProps {
  trigger?: React.ReactNode
  application: Application
  onSuccess?: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function EditApplicationDialog({
  trigger,
  application,
  onSuccess,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange
}: EditApplicationDialogProps) {
  const [open, setOpen] = useState(false)

  const handleSuccess = () => {
    setOpen(false)
    onSuccess?.()
  }

  const isControlled = controlledOpen !== undefined;
  const dialogOpen = isControlled ? controlledOpen : open;
  const handleOpenChange = (newOpen: boolean) => {
    if (isControlled) {
      controlledOnOpenChange?.(newOpen);
    } else {
      setOpen(newOpen);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      {trigger && (
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Application</DialogTitle>
          <DialogDescription>
            Update your application details
          </DialogDescription>
        </DialogHeader>
        <ApplicationForm 
          mode="edit"
          initialData={{
            id: application.id,
            company: application.company,
            position: application.position,
            location: application.location || '',
            status: application.status,
            applied_date: new Date(application.applied_date),
            interview_date: application.interview_date ? new Date(application.interview_date) : null,
            salary: application.salary?.toString() || '',
            link: application.link || '',
            notes: application.notes || '',
            previous_status: application.status // Set current status as previous status
          }}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  )
}
