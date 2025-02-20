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
import type { Application } from '@/types'

interface ApplicationDialogProps {
  trigger?: React.ReactNode
  initialData?: Application
  mode?: 'create' | 'edit'
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSuccess?: () => Promise<void>
}

export function ApplicationDialog({ 
  trigger,
  initialData,
  mode = 'create',
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  onSuccess,
}: ApplicationDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)

  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen
  
  const handleOpenChange = (newOpen: boolean) => {
    if (isControlled) {
      controlledOnOpenChange?.(newOpen)
    } else {
      setUncontrolledOpen(newOpen)
    }
  }

  const handleSuccess = async () => {
    handleOpenChange(false)
    await onSuccess?.()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
          key={initialData?.id || 'new'} // Force form re-render on id change
          initialData={initialData}
          mode={mode}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  )
}
