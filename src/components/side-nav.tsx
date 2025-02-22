'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { UserNav } from "@/components/user-nav"

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
  },
  {
    title: "Applications",
    href: "/dashboard/applications",
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
  },
]

export function SideNav() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen border-r">
      <div className="flex w-64 flex-col">
        <div className="flex h-14 items-center border-b px-4">
          <Link className="flex items-center gap-2 font-semibold" href="/">
            <span className="text-xl">🌊</span>
            <span>FlowTrak</span>
          </Link>
        </div>
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-4 p-4">
            <nav className="grid gap-1">
              {sidebarNavItems.map((item) => (
                <Button
                  key={item.href}
                  variant={pathname === item.href ? "default" : "ghost"}
                  className="w-full justify-start"
                  asChild
                >
                  <Link href={item.href}>{item.title}</Link>
                </Button>
              ))}
            </nav>
          </div>
        </ScrollArea>
        <div className="border-t p-4">
          <UserNav />
        </div>
      </div>
    </div>
  )
}
