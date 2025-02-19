'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  Brain, 
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
    title: 'Resume Review',
    icon: FileText,
    href: '/dashboard/resume',
    description: 'AI-powered resume analysis'
  },
  {
    title: 'Mock Interview',
    icon: MessageSquare,
    href: '/dashboard/interview',
    description: 'Practice with AI interviews'
  },
  {
    title: 'Job Analysis',
    icon: Brain,
    href: '/dashboard/analysis',
    description: 'Get insights on companies'
  },
  {
    title: 'Settings',
    icon: Settings,
    href: '/dashboard/settings',
    description: 'Manage your preferences'
  }
]

interface SidebarProps {
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
}

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname()
  const { user } = useUser()
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="relative flex h-full flex-col">
      {/* Profile Section */}
      <div className="flex items-center justify-between p-4 border-b shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          {user && (
            <Link href="/settings" className="flex items-center gap-3 min-w-0">
              <CustomAvatar userId={user.id} className="h-8 w-8 shrink-0" />
              {!isCollapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium truncate">
                    {user.user_metadata?.name || user.email}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </span>
                </div>
              )}
            </Link>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {!isCollapsed && <ThemeToggle />}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Navigation */}
          <nav className="grid gap-1">
            <Link
              href="/"
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent text-muted-foreground hover:text-foreground",
                isCollapsed && "justify-center"
              )}
            >
              <Home className="h-4 w-4 shrink-0" />
              {!isCollapsed && <span>Home</span>}
            </Link>
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                  pathname === item.href ? "bg-accent" : "transparent",
                  isCollapsed && "justify-center"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!isCollapsed && (
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="truncate">{item.title}</div>
                    <div className="text-xs text-muted-foreground truncate">{item.description}</div>
                  </div>
                )}
              </Link>
            ))}
          </nav>

          {/* Recent Activity */}
          {!isCollapsed && (
            <div className="min-w-0">
              <h3 className="font-medium text-sm mb-2">Recent Activity</h3>
              <div className="pr-4">
                <RecentActivity limit={5} />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Sign Out Button */}
      {!isCollapsed && (
        <div className="p-4 border-t mt-auto shrink-0">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-2 shrink-0" />
            Sign Out
          </Button>
        </div>
      )}
    </div>
  )
}
