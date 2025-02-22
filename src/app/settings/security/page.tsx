'use client'

import { useRouter } from "next/navigation"
import { useUser } from "@/hooks/use-user"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

export default function SecurityPage() {
  const router = useRouter()
  const user = useUser()

  useEffect(() => {
    if (!user) {
      router.push("/auth/signin")
    }
  }, [user, router])

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Security</h3>
        <p className="text-sm text-muted-foreground">
          Manage your account security settings
        </p>
      </div>
      <div className="space-y-4">
        <Button
          variant="destructive"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Sign Out
        </Button>
      </div>
    </div>
  )
}
