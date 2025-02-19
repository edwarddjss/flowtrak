'use client'

import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

interface DeleteAccountDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function DeleteAccountDialog({
  open,
  onOpenChange,
}: DeleteAccountDialogProps) {
  const router = useRouter()
  const [confirmation, setConfirmation] = React.useState('')
  const [isDeleting, setIsDeleting] = React.useState(false)
  const supabase = createClientComponentClient()

  const handleDeleteAccount = async () => {
    if (confirmation.toLowerCase() !== 'delete') {
      toast({
        title: 'Confirmation required',
        description: 'Please type "delete" to confirm account deletion',
        variant: 'destructive',
      })
      return
    }

    try {
      setIsDeleting(true)
      
      // First, delete user data from the database
      const { error: deleteError } = await supabase
        .from('applications')
        .delete()
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)

      if (deleteError) throw deleteError

      // Then delete the user account
      const { error: authError } = await supabase.auth.signOut()
      if (authError) throw authError

      toast({
        title: 'Account deleted',
        description: 'Your account has been successfully deleted.',
      })

      router.push('/auth/signin')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete account. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
      if (onOpenChange) onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Account</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-3">
            <Label htmlFor="confirmation" className="text-sm font-medium">
              Type "delete" to confirm:
            </Label>
            <Input
              id="confirmation"
              placeholder="delete"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              className="col-span-3"
            />
            <p className="text-[0.8rem] text-muted-foreground">
              This will delete your account and all associated data including your applications, settings, and preferences.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => {
              if (onOpenChange) onOpenChange(false)
              setConfirmation('')
            }}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteAccount}
            disabled={isDeleting || confirmation.toLowerCase() !== 'delete'}
          >
            {isDeleting ? 'Deleting...' : 'Delete Account'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
