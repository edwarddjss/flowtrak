'use client'

import { useRouter } from "next/navigation"
import { useUser } from "@/hooks/use-user"
import { useEffect } from "react"

export default function WaitlistPage() {
  const router = useRouter()
  const user = useUser()

  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  return (
    <div className="container max-w-lg py-10">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Join the Waitlist</h1>
          <p className="text-muted-foreground">
            Be the first to know when we launch
          </p>
        </div>
        <div className="space-y-4">
          <form className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded"
            />
            <button
              type="submit"
              className="w-full px-4 py-2 bg-primary text-white rounded"
            >
              Join Waitlist
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
