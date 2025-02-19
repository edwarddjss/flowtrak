'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/dashboard/sidebar'

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

function ClientComponent({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return children({ isCollapsed, setIsCollapsed })
}
