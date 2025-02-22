'use client'

import { useRouter } from "next/navigation"
import { useUser } from "@/hooks/use-user"
import { useEffect } from "react"

export default function OnboardingPage() {
  const router = useRouter()
  const user = useUser()

  useEffect(() => {
    if (!user) {
      router.push("/auth/signin")
    }
  }, [user, router])

  return (
    <div className="container max-w-lg py-10">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Welcome to FlowTrak</h1>
          <p className="text-muted-foreground">
            Let&apos;s get you started
          </p>
        </div>
        <div className="space-y-4">
          <button
            className="w-full"
            onClick={() => router.push("/dashboard")}
          >
            Continue to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
