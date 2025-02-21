import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  console.log('Middleware - Request path:', request.nextUrl.pathname)
  
  const response = NextResponse.next()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  console.log('Middleware - Session:', session ? 'present' : 'missing')
  if (sessionError) console.error('Middleware - Session error:', sessionError)
  
  const { pathname } = request.nextUrl

  // Public routes that don't require auth
  const publicRoutes = ['/', '/auth/signin', '/auth/signup', '/auth/callback']
  const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith('/auth/')
  console.log('Middleware - Is public route:', isPublicRoute)

  // Admin routes that require admin access
  const adminRoutes = ['/admin']
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))
  console.log('Middleware - Is admin route:', isAdminRoute)

  // API routes that should be accessible
  const apiRoutes = ['/api']
  const isApiRoute = apiRoutes.some(route => pathname.startsWith(route))

  // Static files that should be accessible
  const staticRoutes = ['/_next', '/favicon.ico', '/logos']
  const isStaticRoute = staticRoutes.some(route => pathname.startsWith(route))

  if (isStaticRoute || isApiRoute) {
    return response
  }

  // If user is not authenticated and trying to access protected route
  if (!session && !isPublicRoute) {
    console.log('Middleware - No session, redirecting to signin')
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  // If user is authenticated, check their status
  if (session) {
    console.log('Middleware - Checking profile for user:', session.user.id)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_verified, is_admin')
      .eq('id', session.user.id)
      .single()

    if (profileError) {
      console.error('Middleware - Profile error:', profileError)
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }

    console.log('Middleware - Profile data:', profile)

    // If trying to access admin routes, check admin status
    if (isAdminRoute && !profile?.is_admin) {
      console.log('Middleware - Non-admin accessing admin route, redirecting to dashboard')
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // If verified user trying to access waitlist
    if (profile?.is_verified && pathname === '/waitlist') {
      console.log('Middleware - Verified user accessing waitlist, redirecting to dashboard')
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // If unverified user trying to access protected routes
    if (!profile?.is_verified && pathname !== '/waitlist' && !isPublicRoute) {
      console.log('Middleware - Unverified user accessing protected route, redirecting to waitlist')
      return NextResponse.redirect(new URL('/waitlist', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
