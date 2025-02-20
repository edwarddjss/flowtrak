import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

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

  const { data: { session } } = await supabase.auth.getSession()

  // Protected routes
  const protectedPaths = [
    '/dashboard',
    '/applications',
    '/settings',
  ]

  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )

  // Auth routes that should redirect to dashboard if logged in
  const authPaths = ['/auth/signin', '/auth/sign-up']
  const isAuthPath = authPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )

  // Special handling for onboarding
  if (request.nextUrl.pathname === '/onboarding') {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
    
    // Check if user is already onboarded
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_onboarded')
      .eq('id', session.user.id)
      .single()

    if (profile?.is_onboarded) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return response
  }

  // Redirect if path requires auth and user is not logged in
  if (isProtectedPath && !session) {
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  // Redirect to dashboard if user is logged in and trying to access auth pages
  if (isAuthPath && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
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
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
