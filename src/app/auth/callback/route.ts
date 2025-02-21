import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/dashboard'

  if (code) {
    const cookieStore = cookies()
    const supabase = createClient()

    try {
      // Exchange the code for a session
      const { data: { user }, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (sessionError) {
        console.error('Session Error:', sessionError)
        return NextResponse.redirect('https://flowtrak.app/auth/signin?error=auth')
      }

      // Check if user exists in profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_verified, is_admin')
        .eq('id', user!.id)
        .single()

      // If no profile exists, create one
      if (!profile && !profileError) {
        await supabase
          .from('profiles')
          .insert([
            {
              id: user!.id,
              email: user!.email,
              is_verified: false,
              is_admin: false
            }
          ])
        
        // Redirect to waitlist
        return NextResponse.redirect('https://flowtrak.app/waitlist')
      }

      // If user is verified, redirect to dashboard
      if (profile?.is_verified) {
        return NextResponse.redirect('https://flowtrak.app/dashboard')
      }

      // Otherwise, redirect to waitlist
      return NextResponse.redirect('https://flowtrak.app/waitlist')
    } catch (error) {
      console.error('Callback Error:', error)
      return NextResponse.redirect('https://flowtrak.app/auth/signin?error=unknown')
    }
  }

  // If no code, redirect to signin
  return NextResponse.redirect('https://flowtrak.app/auth/signin')
}
