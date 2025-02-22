import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  console.log('🎯 Callback - Starting with URL:', requestUrl.pathname)
  console.log('🔑 Callback - Auth code:', code ? 'present' : 'missing')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    
    try {
      console.log('🔄 Callback - Exchanging code for session')
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('❌ Callback - Exchange error:', error)
        return NextResponse.redirect(`${origin}/auth/signin?error=auth`)
      }

      console.log('✅ Callback - Session exchange successful:', data.session ? 'session exists' : 'no session')
      
      // Double check session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      console.log('🔍 Callback - Verifying session:', session ? 'exists' : 'missing')
      
      if (sessionError) {
        console.error('❌ Callback - Session verification error:', sessionError)
      }

      console.log('↪️ Callback - Redirecting to dashboard')
      return NextResponse.redirect(`${origin}/dashboard`)
    } catch (error) {
      console.error('❌ Callback - Unexpected error:', error)
      return NextResponse.redirect(`${origin}/auth/signin?error=auth`)
    }
  }

  console.log('⚠️ Callback - No code provided, redirecting to signin')
  return NextResponse.redirect(`${origin}/auth/signin`)
}
