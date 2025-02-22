import { auth } from "./auth"
import { NextResponse } from "next/server"

// Middleware to handle auth and redirects
export default auth((req) => {
  const origin = req.headers.get("origin") || ""
  const allowedOrigins = [
    "https://flowtrak.app",
    "https://www.flowtrak.app",
    "http://localhost:3000"
  ]

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    const response = new NextResponse(null, { status: 200 })
    response.headers.set("Access-Control-Allow-Origin", allowedOrigins.includes(origin) ? origin : allowedOrigins[0])
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
    response.headers.set("Access-Control-Max-Age", "86400")
    response.headers.set("Access-Control-Allow-Credentials", "true")
    return response
  }

  // Allow all auth API routes and static files
  if (
    req.nextUrl.pathname.startsWith('/api/auth') ||
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.includes('/favicon.ico') ||
    req.nextUrl.pathname.startsWith('/_vercel')
  ) {
    const response = NextResponse.next()
    response.headers.set("Access-Control-Allow-Origin", allowedOrigins.includes(origin) ? origin : allowedOrigins[0])
    response.headers.set("Access-Control-Allow-Credentials", "true")
    return response
  }

  const isLoggedIn = !!req.auth
  const isPublicRoute = 
    req.nextUrl.pathname === "/" || 
    req.nextUrl.pathname.startsWith("/auth") ||
    req.nextUrl.pathname.startsWith("/about") ||
    req.nextUrl.pathname.startsWith("/privacy") ||
    req.nextUrl.pathname.startsWith("/terms")

  // If the user is logged in and trying to access auth pages, redirect to dashboard
  if (isLoggedIn && req.nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // If the user is not logged in and trying to access protected routes, redirect to sign in
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth/signin", req.url))
  }

  const response = NextResponse.next()
  response.headers.set("Access-Control-Allow-Origin", allowedOrigins.includes(origin) ? origin : allowedOrigins[0])
  response.headers.set("Access-Control-Allow-Credentials", "true")

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
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}