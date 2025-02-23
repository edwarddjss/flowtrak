import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/auth"

// List of allowed origins
const allowedOrigins = [
  'http://localhost:3000',
  'https://flowtrak.app',
  'https://www.flowtrak.app'
]

// Public paths that don't require authentication
const publicPaths = [
  '/auth/signin',
  '/auth/error',
  '/auth/signout',
  '/',
  '/api/auth'
]

// Middleware to handle auth and redirects
export async function middleware(request: NextRequest) {
  const session = await auth()
  const isLoggedIn = !!session
  const path = request.nextUrl.pathname

  // Handle CORS
  const response = NextResponse.next()
  const origin = request.headers.get("origin")

  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  }

  // Always redirect to www in production
  if (process.env.NODE_ENV === 'production' && 
      request.headers.get('host') === 'flowtrak.app' && 
      !path.startsWith('/_next') &&
      !path.startsWith('/api')) {
    return NextResponse.redirect(
      `https://www.flowtrak.app${path}${request.nextUrl.search}`
    )
  }

  // Skip auth check for public paths and API routes
  if (publicPaths.some(p => path.startsWith(p)) || 
      path.startsWith('/_next') || 
      path.startsWith('/api/')) {
    return response
  }

  // Redirect to signin if not authenticated
  if (!isLoggedIn) {
    const signInUrl = new URL('/auth/signin', request.url)
    signInUrl.searchParams.set('callbackUrl', path)
    return NextResponse.redirect(signInUrl)
  }

  return response
}

// Specify which routes middleware will run on
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}