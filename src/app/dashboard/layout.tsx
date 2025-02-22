import { SideNav } from "@/components/side-nav"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

// Prevent static generation for dashboard pages
export const dynamic = 'force-dynamic'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user) {
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
