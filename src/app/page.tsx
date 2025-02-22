'use client'

import { useRouter } from "next/navigation"
import { useUser } from "@/hooks/use-user"
import { useEffect } from "react"
import { LandingPage } from "@/components/landing-page"

export default function HomePage() {
  const router = useRouter()
  const user = useUser()

  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  return <LandingPage />
}
