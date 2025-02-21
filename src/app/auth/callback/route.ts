import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const origin = requestUrl.origin

    console.log('Auth Callback - Starting with code:', code ? 'present' : 'missing')

    if (code) {
      const supabase = createRouteHandlerClient({ cookies })
      
      console.log('Auth Callback - Exchanging code for session')
      const { data: authData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('Auth Callback - Exchange error:', exchangeError)
        return NextResponse.redirect(`${origin}/auth/signin?error=exchange`)
      }

      console.log('Auth Callback - Session exchange successful')

      // Get user session after exchange
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.error('Auth Callback - Session error:', sessionError)
        return NextResponse.redirect(`${origin}/auth/signin?error=session`)
      }

      if (!session) {
        console.error('Auth Callback - No session after successful exchange')
        return NextResponse.redirect(`${origin}/auth/signin?error=no_session`)
      }

      // Add a small delay to ensure the profile creation trigger has completed
      await delay(1000)

      // Attempt to get or create profile
      const getProfile = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_verified, is_admin')
          .eq('id', session.user.id)
          .single()
        
        if (error) {
          console.error('Auth Callback - Profile fetch error:', error)
          // If profile doesn't exist, create it
          if (error.code === 'PGRST116') {
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert([
                { 
                  id: session.user.id,
                  email: session.user.email,
                  is_verified: false,
                  is_admin: false
                }
              ])
              .select()
              .single()
            
            if (createError) {
              throw createError
            }
            return newProfile
          }
          throw error
        }
        return data
      }

      try {
        const profile = await getProfile()
        
        console.log('Auth Callback - Profile data:', profile)

        // If user is verified or admin, redirect to dashboard
        if (profile?.is_verified || profile?.is_admin) {
          console.log('Auth Callback - User is verified/admin, redirecting to dashboard')
          return NextResponse.redirect(`${origin}/dashboard`)
        }

        console.log('Auth Callback - User not verified, redirecting to waitlist')
        return NextResponse.redirect(`${origin}/waitlist`)
      } catch (profileError) {
        console.error('Auth Callback - Profile error:', profileError)
        return NextResponse.redirect(`${origin}/auth/signin?error=profile`)
      }
    }

    console.log('Auth Callback - No code provided, redirecting to signin')
    return NextResponse.redirect(`${origin}/auth/signin`)

  } catch (error) {
    console.error('Auth Callback - Unexpected error:', error)
    return NextResponse.redirect(`${new URL(request.url).origin}/auth/signin?error=unknown`)
  }
}
