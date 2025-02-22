'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Sidebar } from '@/components/dashboard/sidebar'
import { redirect } from 'next/navigation'

interface ClientComponentProps {
  children: (props: {
    isCollapsed: boolean
    setIsCollapsed: (value: boolean) => void
  }) => React.ReactNode
}

export function AuthenticatedLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen max-h-screen bg-background">
      <ClientComponent>
        {({ isCollapsed, setIsCollapsed }) => (
          <div className={`shrink-0 border-r bg-card ${isCollapsed ? 'w-[80px]' : 'w-[240px]'}`}>
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
          </div>
        )}
      </ClientComponent>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}

function ClientComponent({ children }: ClientComponentProps) {
  const { data: session, status } = useSession()
  const [isCollapsed, setIsCollapsed] = useState(false)

  if (status === 'loading') {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  if (!session) {
    redirect('/auth/signin')
  }

  return children({ isCollapsed, setIsCollapsed })
}
