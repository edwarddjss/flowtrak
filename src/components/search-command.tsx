'use client'

import { useEffect, useState, Dispatch, SetStateAction } from 'react'
import { Command, Search } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface SearchCommandProps {
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
}

export function SearchCommand({ open, onOpenChange }: SearchCommandProps) {
  const [shortcut, setShortcut] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const isWindows = navigator.platform.toLowerCase().includes('win')
    setShortcut(isWindows ? 'Ctrl + K' : '⌘ K')
  }, [])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(true)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [onOpenChange])

  if (!mounted) return null

  return (
    <>
      <div className="relative hidden md:block">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <Input
          placeholder={`Search (${shortcut})`}
          className={cn(
            "w-64 pl-9 pr-4",
            "bg-background/95 backdrop-blur-sm",
            "border-muted-foreground/20",
            "focus:border-accent-foreground/30",
            "transition-colors duration-200"
          )}
          onClick={() => onOpenChange(true)}
        />
      </div>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl p-0 gap-0">
          <div className="flex items-center border-b px-4 py-3">
            <Search className="h-4 w-4 text-muted-foreground mr-2" />
            <Input
              className="border-0 focus-visible:ring-0 px-0"
              placeholder="Search applications, companies, jobs..."
              autoFocus
            />
          </div>
          <div className="py-6 px-4 space-y-4">
            <div className="text-sm text-muted-foreground">
              No recent searches
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
