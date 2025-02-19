'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { useMediaQuery } from '@/lib/hooks/use-media-query'
import { 
  ChevronLeft, 
  Menu, 
  Settings, 
  LogOut,
  LayoutDashboard,
  Brain,
  FileText,
  MessageSquare
} from 'lucide-react'
import { ThemeToggle } from '../theme-toggle'
import { RecentActivity } from '../recent-activity'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface Application {
  id: string
  company: string
  position: string
  status: string
  created_at: string
  updated_at: string
  [key: string]: any  // For any additional fields
}

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
  }
]

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const isDesktop = useMediaQuery("(min-width: 1024px)")
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [userDetails, setUserDetails] = useState<{ 
    email: string
    username: string
    avatar_url: string | null
    lastUpdate: number
  } | null>(null)

  // Fetch user details
  const fetchUserDetails = useCallback(async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError) {
        console.error('Auth error:', authError)
        router.push('/auth/signin')
        return
      }
      
      if (!user) {
        console.log('No user found, redirecting to signin')
        router.push('/auth/signin')
        return
      }

      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', user.id)
        .single()

      if (profileError) {
        // If profile doesn't exist, create it
        if (profileError.code === 'PGRST116') {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              username: user.email?.split('@')[0],
              avatar_url: null
            })
            .single()

          if (insertError) {
            console.error('Error creating profile:', insertError)
            return
          }

          setUserDetails({
            email: user.email!,
            username: user.email!.split('@')[0],
            avatar_url: null,
            lastUpdate: Date.now()
          })
          return
        }

        console.error('Profile error:', profileError)
        return
      }

      setUserDetails({
        email: user.email!,
        username: data?.username || user.email!.split('@')[0],
        avatar_url: data?.avatar_url,
        lastUpdate: Date.now()
      })
    } catch (error) {
      console.error('Error in fetchUserDetails:', error)
      router.push('/auth/signin')
    }
  }, [supabase, router])

  useEffect(() => {
    fetchUserDetails()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id)
      if (event === 'SIGNED_IN') {
        await fetchUserDetails()
      } else if (event === 'SIGNED_OUT') {
        router.push('/auth/signin')
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase, fetchUserDetails, router])


  // Auto-collapse sidebar on mobile
  useEffect(() => {
    setSidebarCollapsed(!isDesktop)
  }, [isDesktop])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/signin')
  }

  return (
    <div className="relative flex min-h-screen bg-background">
      {/* Sidebar */}
      <div
        className={cn(
          "fixed lg:sticky lg:top-0 lg:self-start z-20 h-screen transition-transform duration-300 ease-in-out",
          sidebarCollapsed ? "-translate-x-full lg:translate-x-0 lg:w-20" : "translate-x-0 w-80"
        )}
      >
        <Card className={cn(
          "h-full transition-all duration-300 ease-in-out overflow-hidden bg-card border-r border-border shadow-none rounded-none",
          sidebarCollapsed ? "lg:w-20" : "w-80"
        )}>
          <div className="flex flex-col h-full">
            {/* Logo section - always visible */}
            <div className={cn(
              "p-6 border-b border-border flex items-center gap-3 transition-all duration-300",
              sidebarCollapsed ? "lg:justify-center lg:p-4" : ""
            )}>
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <LayoutDashboard className="h-4 w-4 text-primary" />
              </div>
              <div className={cn("transition-opacity duration-300", 
                sidebarCollapsed ? "lg:hidden" : "opacity-100"
              )}>
                <h2 className="text-lg font-semibold">FlowTrak</h2>
                <p className="text-sm text-muted-foreground">
                  Job Tracking
                </p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-4 px-3">
              <nav className="space-y-2">
                {sidebarItems.map((item) => (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                      pathname === item.href 
                        ? "bg-accent text-accent-foreground" 
                        : "text-muted-foreground hover:text-foreground",
                      sidebarCollapsed ? "lg:justify-center lg:px-2" : ""
                    )}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    <div className={cn(
                      "transition-opacity duration-300",
                      sidebarCollapsed ? "lg:hidden" : "opacity-100"
                    )}>
                      <div className="font-medium">{item.title}</div>
                      <div className="text-xs text-muted-foreground">{item.description}</div>
                    </div>
                  </Link>
                ))}
              </nav>

              {/* Recent Activity */}
              <div className={cn(
                "mt-6",
                sidebarCollapsed ? "lg:hidden" : ""
              )}>
                <h3 className="text-sm font-medium mb-2 px-3">Recent Activity</h3>
                <RecentActivity limit={5} />
              </div>
            </div>

            {/* Profile Section */}
            <div className="mt-auto border-t border-border">
              <div className={cn(
                "p-4 flex items-center gap-3",
                sidebarCollapsed ? "lg:justify-center" : ""
              )}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                      <Avatar className="h-9 w-9">
                        {userDetails?.avatar_url ? (
                          <AvatarImage 
                            src={userDetails.avatar_url} 
                            alt="Profile" 
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <AvatarFallback>
                            {userDetails?.email?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{userDetails?.username}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {userDetails?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link href="/dashboard/settings">
                      <DropdownMenuItem className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-500 focus:text-red-500">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className={cn(
                  "flex-1 min-w-0",
                  sidebarCollapsed ? "lg:hidden" : ""
                )}>
                  <div className="text-sm font-medium truncate">
                    {userDetails?.username}
                  </div>
                </div>

                <div className={cn(
                  "flex items-center",
                  sidebarCollapsed ? "lg:hidden" : ""
                )}>
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className={cn(
        "flex-1 flex flex-col gap-6 p-8 transition-all duration-300 ease-in-out",
        sidebarCollapsed ? "lg:pl-28" : "lg:pl-6"
      )}>
        {children}
      </div>

      {/* Collapse Button */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "fixed z-30 transition-all duration-300 ease-in-out",
          "top-4 hover:bg-accent hover:text-accent-foreground",
          sidebarCollapsed 
            ? "lg:left-[4.5rem] left-4" 
            : "lg:left-72"
        )}
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
      >
        {sidebarCollapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>

      {/* Mobile Overlay */}
      {!sidebarCollapsed && !isDesktop && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-10"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
    </div>
  )
}
