import { SideNav } from "@/components/side-nav"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

// Prevent static generation for dashboard pages
export const dynamic = 'force-dynamic'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/auth/signin')
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <SideNav />
      <main className="flex-1 overflow-y-auto bg-muted/10">
        {children}
      </main>
    </div>
  )
}
