'use client'

import { useUser } from "@/hooks/use-user"
import { redirect } from "next/navigation"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { profile, isLoading } = useUser()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  if (!profile?.is_admin) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-bold">Flowtrak Admin</h1>
        </div>
      </nav>
      {children}
    </div>
  )
}
