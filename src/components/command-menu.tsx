"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Button } from "./ui/button"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Application } from "@/types"
import { format } from "date-fns"
import { Badge } from "./ui/badge"
import { cn, getOperatingSystem } from "@/lib/utils"

interface CommandMenuProps {
  userId: string
}

export function CommandMenu({ userId }: CommandMenuProps) {
  const [open, setOpen] = React.useState(false)
  const [applications, setApplications] = React.useState<Application[]>([])
  const [searchQuery, setSearchQuery] = React.useState("")
  const [os] = React.useState(getOperatingSystem())
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  React.useEffect(() => {
    if (!open || !searchQuery) {
      setApplications([])
      return
    }

    const fetchApplications = async () => {
      const supabase = createClientComponentClient()
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', userId)
        .or(`company.ilike.%${searchQuery}%,position.ilike.%${searchQuery}%`)
        .order('applied_date', { ascending: false })
        .limit(5)

      if (!error && data) {
        setApplications(data)
      }
    }

    fetchApplications()
  }, [searchQuery, userId, open])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'interviewing':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
      case 'offer':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
      case 'accepted':
        return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'rejected':
        return 'bg-red-500/10 text-red-500 border-red-500/20'
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    }
  }

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-64 lg:w-96 transition-colors hover:bg-muted/50"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">Search applications...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          {os === 'mac' ? (
            <>
              <span className="text-xs">⌘</span>K
            </>
          ) : (
            <>
              <span className="text-xs">Ctrl</span>K
            </>
          )}
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Search all applications..." 
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          <CommandEmpty>No applications found.</CommandEmpty>
          <CommandGroup heading="Recent Applications">
            {applications.map((app) => (
              <CommandItem
                key={app.id}
                value={`${app.company} ${app.position}`}
                onSelect={() => {
                  setOpen(false)
                  router.push(`/applications/${app.id}`)
                }}
                className="cursor-pointer"
              >
                <div className="flex flex-col w-full gap-1 py-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{app.company}</span>
                    <Badge 
                      variant="secondary" 
                      className={cn("capitalize", getStatusColor(app.status))}
                    >
                      {app.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{app.position}</span>
                    <span>{format(new Date(app.applied_date), 'MMM d, yyyy')}</span>
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup>
            <CommandItem
              onSelect={() => {
                setOpen(false)
                router.push('/applications')
              }}
              className="cursor-pointer justify-center text-sm text-muted-foreground"
            >
              View all applications →
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
