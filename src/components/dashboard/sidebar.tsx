'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  LogOut,
  Home
} from 'lucide-react'
import { RecentActivity } from '@/components/recent-activity'
import { useUser } from '@/lib/hooks/use-user'
import { CustomAvatar } from '@/components/ui/custom-avatar'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { ThemeToggle } from '@/components/theme-toggle'
import { ScrollArea } from '@/components/ui/scroll-area'

const sidebarItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    description: 'Overview of your applications'
  },
  {
    title: 'Settings',
    icon: Settings,
    href: '/settings',
    description: 'Manage your account'
  }
]

interface SidebarProps {
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
}

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useUser()
  const supabase = createClientComponentClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <div className="relative h-full flex flex-col justify-between">
      <div className="flex flex-col">
        <div className="flex items-center justify-between px-4 py-2">
          <Link href="/dashboard" className={cn(
            "flex items-center gap-2",
            isCollapsed && "justify-center"
          )}>
            <Home className="h-6 w-6" />
            {!isCollapsed && <span className="font-bold">FlowTrak</span>}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <ScrollArea className="flex-1 px-4">
          <div className="space-y-2 py-4">
            {sidebarItems.map((item) => {
              const isActive = pathname?.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground",
                    isActive && "bg-muted text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              )
            })}
          </div>

          {!isCollapsed && (
            <div className="py-4">
              <RecentActivity />
            </div>
          )}
        </ScrollArea>
      </div>

      <div className="flex flex-col gap-4 p-4 border-t">
        <div className="flex items-center gap-2">
          <CustomAvatar user={user} className="h-8 w-8" />
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user?.email}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
