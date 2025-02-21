import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const origin = requestUrl.origin

    if (code) {
      const supabase = createRouteHandlerClient({ cookies })
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Auth error:', error)
        return NextResponse.redirect(`${origin}/auth/signin?error=auth`)
      }

      // Get user session and check verification status
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_verified, is_admin')
          .eq('id', session.user.id)
          .single()

        // If user is verified or admin, redirect to dashboard
        if (profile?.is_verified || profile?.is_admin) {
          return NextResponse.redirect(`${origin}/dashboard`)
        }

        // If user is not verified, redirect to waitlist
        return NextResponse.redirect(`${origin}/waitlist`)
      }
    }

    // Fallback to sign in page
    return NextResponse.redirect(`${origin}/auth/signin`)

  } catch (error) {
    console.error('Callback Error:', error)
    const origin = new URL(request.url).origin
    return NextResponse.redirect(`${origin}/auth/signin?error=unknown`)
  }
}
