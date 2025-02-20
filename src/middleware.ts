import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  // Check if the request is to a protected route
  const isProtectedRoute = req.nextUrl.pathname.startsWith('/dashboard') || 
                          req.nextUrl.pathname.startsWith('/applications') || 
                          req.nextUrl.pathname.startsWith('/settings') ||
                          (req.nextUrl.pathname.startsWith('/api/') && 
                           !req.nextUrl.pathname.startsWith('/api/auth'))

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/auth/signin', req.url))
  }

  // If user is a new signup and hasn't completed onboarding
  if (session?.user.user_metadata?.isNewUser === true) {
    // Allow access to onboarding page
    if (req.nextUrl.pathname === '/onboarding') {
      return res
    }
    // Redirect to onboarding for all other authenticated routes
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL('/onboarding', req.url))
    }
  }

  return res
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|auth/callback).*)',
  ],
}
