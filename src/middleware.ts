import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  console.log('\n=== Middleware Start ===')
  console.log('Request URL:', request.url)
  console.log('Pathname:', request.nextUrl.pathname)
  
  const response = NextResponse.next()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = request.cookies.get(name)
          console.log('Reading cookie:', name, cookie ? 'present' : 'missing')
          return cookie?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          console.log('Setting cookie:', name)
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          console.log('Removing cookie:', name)
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
  console.log('Session check result:', {
    hasSession: !!session,
    userId: session?.user?.id,
    error: sessionError?.message
  })
  
  const { pathname } = request.nextUrl

  // Public routes that don't require auth
  const publicRoutes = ['/', '/auth/signin', '/auth/signup', '/auth/callback']
  const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith('/auth/')
  console.log('Route check:', {
    pathname,
    isPublicRoute,
    matchedPublicRoute: publicRoutes.find(r => pathname.startsWith(r))
  })

  // Admin routes that require admin access
  const adminRoutes = ['/admin']
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))
  console.log('Admin route check:', { isAdminRoute })

  // API routes that should be accessible
  const apiRoutes = ['/api']
  const isApiRoute = apiRoutes.some(route => pathname.startsWith(route))

  // Static files that should be accessible
  const staticRoutes = ['/_next', '/favicon.ico', '/logos', '/testimonials']
  const isStaticRoute = staticRoutes.some(route => pathname.startsWith(route))
  
  console.log('Route type:', {
    isApiRoute,
    isStaticRoute,
    matchedStaticRoute: staticRoutes.find(r => pathname.startsWith(r))
  })

  if (isStaticRoute || isApiRoute) {
    console.log('Allowing static/api route')
    return response
  }

  // If user is not authenticated and trying to access protected route
  if (!session && !isPublicRoute) {
    console.log('No session, redirecting to signin from:', pathname)
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  // If user is authenticated, check their status
  if (session) {
    console.log('Checking profile for user:', session.user.id)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_verified, is_admin')
      .eq('id', session.user.id)
      .single()

    console.log('Profile check result:', {
      hasProfile: !!profile,
      isVerified: profile?.is_verified,
      isAdmin: profile?.is_admin,
      error: profileError?.message
    })

    if (profileError) {
      console.error('Profile fetch error:', profileError)
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }

    // If trying to access admin routes, check admin status
    if (isAdminRoute && !profile?.is_admin) {
      console.log('Non-admin accessing admin route, redirecting to dashboard')
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // If verified user trying to access waitlist
    if (profile?.is_verified && pathname === '/waitlist') {
      console.log('Verified user accessing waitlist, redirecting to dashboard')
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // If unverified user trying to access protected routes
    if (!profile?.is_verified && pathname !== '/waitlist' && !isPublicRoute) {
      console.log('Unverified user accessing protected route, redirecting to waitlist')
      return NextResponse.redirect(new URL('/waitlist', request.url))
    }
  }

  console.log('=== Middleware End ===\n')
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}