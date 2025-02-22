import { auth } from "./auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Middleware to handle auth and redirects
export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnLandingPage = req.nextUrl.pathname === "/"
  const isOnAuthPage = req.nextUrl.pathname.startsWith("/auth")
  const isApiAuthRoute = req.nextUrl.pathname.startsWith("/api/auth")

  // Allow all auth API routes
  if (isApiAuthRoute) {
    return NextResponse.next()
  }

  // Redirect authenticated users away from auth pages
  if (isLoggedIn && (isOnLandingPage || isOnAuthPage)) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // Redirect unauthenticated users to sign in
  if (!isLoggedIn && !isOnLandingPage && !isOnAuthPage) {
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