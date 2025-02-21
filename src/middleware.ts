import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
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

  const { data: { session }, error } = await supabase.auth.getSession()
  const { pathname } = request.nextUrl

  // Public routes that don't require auth
  const publicRoutes = ['/', '/auth/signin', '/auth/signup', '/auth/callback', '/waitlist']
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith('/auth/'))

  // Admin routes that require admin access
  const adminRoutes = ['/admin']
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))

  // API routes that should be accessible
  const apiRoutes = ['/api']
  const isApiRoute = apiRoutes.some(route => pathname.startsWith(route))

  // Static files that should be accessible
  const staticRoutes = ['/_next', '/favicon.ico', '/logos']
  const isStaticRoute = staticRoutes.some(route => pathname.startsWith(route))

  if (isStaticRoute || isApiRoute) {
    return response
  }

  // Check if user is authenticated
  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  // If user is authenticated but not verified and trying to access protected routes
  if (session && !isPublicRoute) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_verified')
      .eq('id', session.user.id)
      .single()

    if (!profile?.is_verified && pathname !== '/waitlist') {
      return NextResponse.redirect(new URL('/waitlist', request.url))
    }
  }

  // Check admin access
  if (isAdminRoute && session) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', session.user.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
