'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { CustomAvatar } from '@/components/ui/custom-avatar'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { steps } from '@/config/steps'

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
  currentStep: string
  onStepChange: (step: string) => void
}

export function Sidebar({ className, isCollapsed, setIsCollapsed, currentStep, onStepChange }: SidebarProps) {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      getUser()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  return (
    <div className={cn('relative flex flex-col h-screen', className)}>
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <div className="flex items-center gap-2">
          {user && (
            <Link href="/settings" className="flex items-center gap-2">
              <CustomAvatar userId={user.id} className="h-8 w-8" />
              {!isCollapsed && (
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {user.user_metadata?.name || user.email}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              )}
            </Link>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "h-8 w-8 absolute -right-4 top-6 rounded-full bg-background border shadow-sm hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <ChevronLeft className={cn(
            "h-4 w-4 transition-transform",
            isCollapsed && "rotate-180"
          )} />
        </button>
      </div>
      
      <nav className="flex-1 space-y-2 p-2">
        <Link
          href="/mock-interview"
          className={cn(
            buttonVariants({ variant: pathname === '/mock-interview' ? 'default' : 'ghost' }),
            'w-full justify-start',
            isCollapsed && 'justify-center'
          )}
        >
          {!isCollapsed && <span>Mock Interview</span>}
        </Link>
        <Link
          href="/settings"
          className={cn(
            buttonVariants({ variant: pathname === '/settings' ? 'default' : 'ghost' }),
            'w-full justify-start',
            isCollapsed && 'justify-center'
          )}
        >
          {!isCollapsed && <span>Settings</span>}
        </Link>
        {steps.map((step) => {
          const isActive = currentStep === step.id
          return (
            <Link
              key={step.id}
              href={step.href}
              className={cn(
                buttonVariants({ variant: isActive ? 'default' : 'ghost' }),
                'w-full justify-start',
                isCollapsed && 'justify-center'
              )}
              onClick={() => onStepChange(step.id)}
            >
              <step.icon className="h-4 w-4" />
              {!isCollapsed && <span>{step.name}</span>}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
