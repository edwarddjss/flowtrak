import { auth } from "./auth"
import { NextResponse } from "next/server"
import type { NextAuthRequest } from "next-auth/lib"

export default auth(async (req: NextAuthRequest) => {
  const isLoggedIn = !!req.auth
  const isOnLandingPage = req.nextUrl.pathname === "/"
  const isOnAuthPage = req.nextUrl.pathname.startsWith("/auth")

  if (isLoggedIn && (isOnLandingPage || isOnAuthPage)) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  if (!isLoggedIn && !isOnLandingPage && !isOnAuthPage) {
    return NextResponse.redirect(new URL("/auth/signin", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}