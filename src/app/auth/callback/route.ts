import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    if (!code) {
      return NextResponse.redirect('https://flowtrak.app/auth/signin')
    }

    const supabase = createClient()

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
      
      const response = NextResponse.redirect('https://flowtrak.app/waitlist')
      response.cookies.set('sb-auth-token', '', { 
        maxAge: 0,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        domain: process.env.NODE_ENV === 'production' ? '.flowtrak.app' : undefined
      })
      return response
    }

    // If user is verified, redirect to dashboard
    if (profile?.is_verified) {
      const response = NextResponse.redirect('https://flowtrak.app/dashboard')
      response.cookies.set('sb-auth-token', '', {
        maxAge: 0,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        domain: process.env.NODE_ENV === 'production' ? '.flowtrak.app' : undefined
      })
      return response
    }

    // Otherwise, redirect to waitlist
    const response = NextResponse.redirect('https://flowtrak.app/waitlist')
    response.cookies.set('sb-auth-token', '', {
      maxAge: 0,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      domain: process.env.NODE_ENV === 'production' ? '.flowtrak.app' : undefined
    })
    return response

  } catch (error) {
    console.error('Callback Error:', error)
    return NextResponse.redirect('https://flowtrak.app/auth/signin?error=unknown')
  }
}
