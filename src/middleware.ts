import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // First, check if it's a static or special route that should bypass auth
  const staticRoutes = ['/_next', '/favicon.ico', '/logos', '/testimonials']
  const isStaticRoute = staticRoutes.some(route => pathname.startsWith(route))
  
  const apiRoutes = ['/api']
  const isApiRoute = apiRoutes.some(route => pathname.startsWith(route))

  if (isStaticRoute || isApiRoute) {
    return NextResponse.next()
  }

  // Initialize response
  const response = NextResponse.next()
  
  // Create Supabase client
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

  // Check if this is an auth-related route
  const authRoutes = ['/auth/signin', '/auth/signup', '/auth/callback']
  const isAuthRoute = authRoutes.includes(pathname) || pathname.startsWith('/auth/')
  
  // Always allow access to auth routes
  if (isAuthRoute) {
    return response
  }

  // For all other routes, check authentication
  try {
    const { data: { session } } = await supabase.auth.getSession()

    // Public routes that don't require auth
    const publicRoutes = ['/', '/about', '/contact'] 
    const isPublicRoute = publicRoutes.includes(pathname)

    // If we have a session and user is trying to access public route (like landing page)
    if (session && isPublicRoute && pathname === '/') {
      // Redirect authenticated users away from landing page to dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // If no session and trying to access protected route
    if (!session && !isPublicRoute) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }

    // If we have a session, check user status
    if (session) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_verified, is_admin')
        .eq('id', session.user.id)
        .single()

      if (profileError) {
        console.error('Profile error:', profileError)
        return NextResponse.redirect(new URL('/auth/signin', request.url))
      }

      // Admin routes check
      const adminRoutes = ['/admin']
      const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))
      
      if (isAdminRoute && !profile?.is_admin) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }

      // Waitlist handling
      if (profile?.is_verified && pathname === '/waitlist') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }

      if (!profile?.is_verified && pathname !== '/waitlist' && !isPublicRoute) {
        return NextResponse.redirect(new URL('/waitlist', request.url))
      }
    }

    return response
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}