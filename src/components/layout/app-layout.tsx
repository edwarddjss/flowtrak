'use client'

import { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

interface AppLayoutProps {
  children: ReactNode
  sidebar?: ReactNode
  header?: ReactNode
}

export function AppLayout({ children, sidebar, header }: AppLayoutProps) {
  const { theme } = useTheme()

  return (
    <div className="app-layout">
      {/* Header */}
      <header className="header-container">
        <div className="h-full px-6 flex items-center justify-between">
          {header}
        </div>
      </header>

      {/* Sidebar */}
      <aside className="sidebar-container">
        <div className="h-full py-6 px-4 overflow-y-auto">
          {sidebar}
        </div>
      </aside>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.main
          key={window.location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="main-container"
        >
          {children}
        </motion.main>
      </AnimatePresence>
    </div>
  )
}
