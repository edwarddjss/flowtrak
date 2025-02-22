import { auth } from "./auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// List of allowed origins
const allowedOrigins = [
  'https://www.flowtrak.app',
  'https://flowtrak.app',
  'http://localhost:3000'
]

// Middleware to handle auth and redirects
export default auth((req) => {
  const origin = req.headers.get("origin")
  const response = NextResponse.next()

  // Handle CORS
  if (origin) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token')
  }

  // Always redirect to www in production
  if (process.env.NODE_ENV === 'production' && 
      req.headers.get('host') === 'flowtrak.app' && 
      !req.nextUrl.pathname.startsWith('/_next') &&
      !req.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.redirect(
      `https://www.flowtrak.app${req.nextUrl.pathname}${req.nextUrl.search}`
    )
  }

  const isLoggedIn = !!req.auth
  const isPublicRoute = 
    req.nextUrl.pathname === "/" || 
    req.nextUrl.pathname.startsWith("/auth") ||
    req.nextUrl.pathname.startsWith("/about") ||
    req.nextUrl.pathname.startsWith("/privacy") ||
    req.nextUrl.pathname.startsWith("/terms") ||
    req.nextUrl.pathname.startsWith("/api/auth")

  // Redirect authenticated users away from auth pages
  if (isLoggedIn && req.nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // Redirect unauthenticated users to sign in
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth/signin", req.url))
  }

  return response
})

// Specify which routes middleware will run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}