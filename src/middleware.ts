import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  console.log(' Middleware - Path:', pathname)

  // Bypass auth check for static files
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/api')
  ) {
    console.log(' Middleware - Static file bypass:', pathname)
    return NextResponse.next()
  }

  const response = NextResponse.next()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = request.cookies.get(name)
          console.log(' Middleware - Getting cookie:', name, cookie ? 'exists' : 'missing')
          return cookie?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          console.log(' Middleware - Setting cookie:', name)
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          console.log(' Middleware - Removing cookie:', name)
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Allow all auth routes
  if (pathname.startsWith('/auth')) {
    console.log(' Middleware - Auth route bypass:', pathname)
    return response
  }

  console.log(' Middleware - Checking session for:', pathname)
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  
  if (sessionError) {
    console.error(' Middleware - Session error:', sessionError)
  }

  console.log(' Middleware - Session status:', session ? 'exists' : 'missing')

  // If user is signed in and tries to access landing page, redirect to dashboard
  if (session && pathname === '/') {
    console.log(' Middleware - Redirecting authenticated user from landing to dashboard')
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If no session and trying to access protected route, redirect to signin
  if (!session && pathname !== '/') {
    console.log(' Middleware - Redirecting unauthenticated user to signin')
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  console.log(' Middleware - Allowing access to:', pathname)
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}