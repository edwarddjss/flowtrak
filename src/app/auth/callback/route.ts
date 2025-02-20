import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/dashboard'
  const isSignUp = requestUrl.searchParams.get('signup') === 'true'

  if (code) {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const { data: { user } } = await supabase.auth.exchangeCodeForSession(code)

    // Only set isNewUser flag for new signups
    if (isSignUp && user) {
      await supabase.auth.updateUser({
        data: { isNewUser: true }
      })
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }

    // Check if user has completed avatar setup
    if (user && !user.user_metadata.avatar_id) {
      return NextResponse.redirect(new URL('/account-setup', request.url))
    }

    // Redirect to dashboard by default
    return NextResponse.redirect(new URL(next, request.url))
  }

  // If no code, redirect to home
  return NextResponse.redirect(new URL('/', request.url))
}
