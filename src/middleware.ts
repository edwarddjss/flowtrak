import { auth } from "./auth"

export default auth((req) => {
  // If user is signed in and tries to access landing page
  if (req.auth?.user && req.nextUrl.pathname === "/") {
    return Response.redirect(new URL("/dashboard", req.nextUrl))
  }
  return null
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|auth).*)"],
}