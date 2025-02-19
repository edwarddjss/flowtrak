'use client'

import { Suspense } from 'react'
import DashboardContent from '@/components/dashboard-content'
import { DashboardSkeleton } from '@/components/dashboard-skeleton'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-black/95 to-black/90">
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  )
}
