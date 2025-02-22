import { auth } from "./auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Middleware to handle auth and redirects
export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isPublicRoute = 
    req.nextUrl.pathname === "/" || 
    req.nextUrl.pathname.startsWith("/auth") ||
    req.nextUrl.pathname.startsWith("/about") ||
    req.nextUrl.pathname.startsWith("/privacy") ||
    req.nextUrl.pathname.startsWith("/terms")

  // Redirect authenticated users away from auth pages
  if (isLoggedIn && req.nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // Redirect unauthenticated users to sign in
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth/signin", req.url))
  }

  return NextResponse.next()
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