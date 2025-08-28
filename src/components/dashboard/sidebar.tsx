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
  FileText,
  BarChart3,
  ListTodo,
  User,
  Calendar,
  Briefcase,
  BadgeCheck,
  PieChart,
  Bell,
  ShieldCheck
} from 'lucide-react'
import { RecentActivity } from '@/components/recent-activity'
import { useUser } from '@/lib/hooks/use-user'
import { CustomAvatar } from '@/components/ui/custom-avatar'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { ThemeToggle } from '@/components/theme-toggle'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip'

interface SidebarItem {
  title: string;
  icon: React.ElementType;
  href: string;
  description: string;
  badge?: string | number;
  highlight?: boolean;
  children?: {
    title: string;
    href: string;
    icon?: React.ElementType;
  }[];
}

const mainNavItems: SidebarItem[] = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    description: 'Overview of your applications',
    badge: 'New',
    highlight: true
  },
  {
    title: 'Applications',
    icon: Briefcase,
    href: '/dashboard/applications',
    description: 'Manage your job applications',
    children: [
      {
        title: 'All Applications',
        href: '/dashboard/applications',
        icon: ListTodo
      },
      {
        title: 'Calendar View',
        href: '/dashboard/applications/calendar',
        icon: Calendar
      },
      {
        title: 'Kanban Board',
        href: '/dashboard/applications/kanban',
        icon: BadgeCheck
      }
    ]
  },
  {
    title: 'Analytics',
    icon: BarChart3,
    href: '/dashboard/analytics',
    description: 'View your application analytics',
    children: [
      {
        title: 'Overview',
        href: '/dashboard/analytics',
        icon: PieChart
      },
      {
        title: 'Insights',
        href: '/dashboard/analytics/insights',
        icon: BarChart3
      }
    ]
  },
  {
    title: 'Resume',
    icon: FileText,
    href: '/dashboard/resume',
    description: 'Manage your resumes and documents',
  }
]

const secondaryNavItems: SidebarItem[] = [
  {
    title: 'Settings',
    icon: Settings,
    href: '/settings',
    description: 'Manage your account settings',
    children: [
      {
        title: 'Profile',
        href: '/settings',
        icon: User
      },
      {
        title: 'Notifications',
        href: '/settings/notifications',
        icon: Bell
      },
      {
        title: 'Security',
        href: '/settings/security',
        icon: ShieldCheck
      }
    ]
  }
]

interface SidebarProps {
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
}

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user }: { user: SupabaseUser | null } = useUser()
  const supabase = createClientComponentClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  // Determine if a route is active or one of its children is active
  const isRouteActive = (route: SidebarItem) => {
    // Exact match
    if (pathname === route.href) return true
    
    // Check if it's the parent route of the current path
    if (pathname?.startsWith(route.href) && route.href !== '/') return true
    
    // Check if any children are active
    if (route.children) {
      return route.children.some(child => pathname === child.href)
    }
    
    return false
  }

  // Determine if we should show children of an item
  const shouldShowChildren = (item: SidebarItem) => {
    return !isCollapsed && (isRouteActive(item) || item.children?.some(child => pathname === child.href))
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div className="relative h-full flex flex-col justify-between border-r">
        <div className="flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 h-16 border-b">
            <Link href="/dashboard" className={cn(
              "flex items-center gap-2",
              isCollapsed && "justify-center"
            )}>
              <Briefcase className="h-6 w-6 text-primary" />
              {!isCollapsed && <span className="font-bold text-xl">FlowTrak</span>}
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-8 w-8"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>

          <ScrollArea className="flex-1 px-3 py-2">
            <div className="space-y-1 py-2">
              {mainNavItems.map((item) => {
                const isActive = isRouteActive(item)
                return (
                  <div key={item.href} className="mb-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={item.href}
                          className={cn(
                            "group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition-colors",
                            isActive 
                              ? "bg-primary/10 text-primary" 
                              : "text-muted-foreground hover:text-foreground",
                            item.highlight && !isActive && "text-foreground",
                            isCollapsed && "justify-center"
                          )}
                        >
                          <item.icon className={cn(
                            "h-5 w-5 shrink-0",
                            isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                            item.highlight && !isActive && "text-foreground"
                          )} />
                          
                          {!isCollapsed && (
                            <span className="truncate">{item.title}</span>
                          )}
                          
                          {!isCollapsed && item.badge && (
                            <Badge variant="outline" className="ml-auto text-xs py-0 h-5 px-2">
                              {item.badge}
                            </Badge>
                          )}
                          
                          {!isCollapsed && item.children && (
                            <ChevronRight 
                              className={cn(
                                "ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                                shouldShowChildren(item) && "rotate-90"
                              )} 
                            />
                          )}
                        </Link>
                      </TooltipTrigger>
                      {isCollapsed && (
                        <TooltipContent side="right">
                          {item.title}
                          {item.badge && ` (${item.badge})`}
                        </TooltipContent>
                      )}
                    </Tooltip>
                    
                    {/* Children for each menu item */}
                    {shouldShowChildren(item) && item.children && (
                      <div className="mt-1 ml-4 pl-4 border-l space-y-1">
                        {item.children.map((child) => {
                          const isChildActive = pathname === child.href
                          const Icon = child.icon
                          
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={cn(
                                "group flex w-full items-center gap-3 rounded-md px-3 py-2 text-xs font-medium hover:bg-muted transition-colors",
                                isChildActive 
                                  ? "bg-muted text-foreground" 
                                  : "text-muted-foreground hover:text-foreground"
                              )}
                            >
                              {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
                              <span className="truncate">{child.title}</span>
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="mt-6 pt-6 border-t">
              <p className={cn(
                "px-3 py-1 text-xs font-semibold text-muted-foreground",
                isCollapsed && "text-center"
              )}>
                {!isCollapsed ? 'Settings' : '•••'}
              </p>
              <div className="space-y-1 py-2">
                {secondaryNavItems.map((item) => {
                  const isActive = isRouteActive(item)
                  return (
                    <div key={item.href} className="mb-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            href={item.href}
                            className={cn(
                              "group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition-colors",
                              isActive 
                                ? "bg-muted text-foreground" 
                                : "text-muted-foreground hover:text-foreground",
                              isCollapsed && "justify-center"
                            )}
                          >
                            <item.icon className="h-5 w-5 shrink-0" />
                            
                            {!isCollapsed && (
                              <span className="truncate">{item.title}</span>
                            )}
                            
                            {!isCollapsed && item.children && (
                              <ChevronRight 
                                className={cn(
                                  "ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                                  shouldShowChildren(item) && "rotate-90"
                                )} 
                              />
                            )}
                          </Link>
                        </TooltipTrigger>
                        {isCollapsed && (
                          <TooltipContent side="right">
                            {item.title}
                          </TooltipContent>
                        )}
                      </Tooltip>
                      
                      {/* Children for each settings menu item */}
                      {shouldShowChildren(item) && item.children && (
                        <div className="mt-1 ml-4 pl-4 border-l space-y-1">
                          {item.children.map((child) => {
                            const isChildActive = pathname === child.href
                            const Icon = child.icon
                            
                            return (
                              <Link
                                key={child.href}
                                href={child.href}
                                className={cn(
                                  "group flex w-full items-center gap-3 rounded-md px-3 py-2 text-xs font-medium hover:bg-muted transition-colors",
                                  isChildActive 
                                    ? "bg-muted text-foreground" 
                                    : "text-muted-foreground hover:text-foreground"
                                )}
                              >
                                {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
                                <span className="truncate">{child.title}</span>
                              </Link>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {!isCollapsed && (
              <div className="py-4">
                <RecentActivity />
              </div>
            )}
          </ScrollArea>
        </div>

        <div className="flex flex-col gap-2 p-3 border-t bg-muted/20">
          <div className="flex items-center gap-3 px-2 py-2">
            <CustomAvatar user={user} className="h-8 w-8" />
            {!isCollapsed && (
              <div className="flex flex-col space-y-0.5">
                <span className="text-sm font-medium leading-none">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                </span>
                <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                  {user?.email}
                </span>
              </div>
            )}
            <div className={cn("flex items-center gap-1", !isCollapsed && "ml-auto")}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ThemeToggle />
                </TooltipTrigger>
                <TooltipContent side={isCollapsed ? "right" : "top"}>
                  Toggle theme
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side={isCollapsed ? "right" : "top"}>
                  Sign out
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
