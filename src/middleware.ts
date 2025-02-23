import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/auth"

// List of allowed origins
const allowedOrigins = [
  'http://localhost:3000',
  'https://flowtrak.app',
  'https://www.flowtrak.app'
]

// Middleware to handle auth and redirects
export async function middleware(request: NextRequest) {
  const session = await auth()
  const isLoggedIn = !!session

  // Handle CORS
  const response = NextResponse.next()
  const origin = request.headers.get("origin")

  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  }

  // Always redirect to www in production
  if (process.env.NODE_ENV === 'production' && 
      request.headers.get('host') === 'flowtrak.app' && 
      !request.nextUrl.pathname.startsWith('/_next') &&
      !request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.redirect(
      `https://www.flowtrak.app${request.nextUrl.pathname}${request.nextUrl.search}`
    )
  }

  const isPublicRoute = 
    request.nextUrl.pathname === "/" || 
    request.nextUrl.pathname.startsWith("/about") ||
    request.nextUrl.pathname.startsWith("/privacy") ||
    request.nextUrl.pathname.startsWith("/terms") ||
    request.nextUrl.pathname.startsWith("/api/auth")

  // Redirect authenticated users away from auth pages
  if (isLoggedIn && request.nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Protect dashboard routes
  if (!isLoggedIn && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/auth/signin", request.url))
  }

  // Redirect unauthenticated users to sign in
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth/signin", request.url))
  }

  return response
}

// Specify which routes middleware will run on
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}