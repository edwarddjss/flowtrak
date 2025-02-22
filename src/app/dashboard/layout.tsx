import { SideNav } from "@/components/side-nav"
import { useUser } from "@/hooks/use-user"
import { redirect } from "next/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = useUser()

  if (!user) {
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
