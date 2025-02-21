'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function WaitlistPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }
    getUser()
  }, [supabase])

  if (loading) {
    return null
  }

  if (!user) {
    router.replace('/auth/signin')
    return null
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Welcome to the Waitlist!</CardTitle>
          <CardDescription>
            Thank you for joining Flowtrak. We're currently in beta and are carefully onboarding users to ensure the best experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Your account is currently in the waitlist. We'll notify you via email ({user.email}) when you're granted access.
          </p>
          <div className="space-y-2">
            <h3 className="font-medium">While you wait:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Follow us on Twitter for updates</li>
              <li>Join our Discord community</li>
              <li>Check out our blog for job search tips</li>
            </ul>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => window.open('https://twitter.com/flowtrakapp', '_blank')}>
              Twitter
            </Button>
            <Button variant="outline" onClick={() => window.open('https://discord.gg/flowtrak', '_blank')}>
              Discord
            </Button>
            <Button variant="outline" onClick={() => window.open('https://blog.flowtrak.app', '_blank')}>
              Blog
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
