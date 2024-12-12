import authConfig from "@/lib/auth/config"
import NextAuth from "next-auth"

const { auth } = NextAuth(authConfig)

export default auth(async function middleware(req) {
  const { auth, nextUrl } = req

  const isAuthenticated = !!auth

  const PROTECTED_ROUTES = ["/access", "/x"]

  if (PROTECTED_ROUTES.some((route) => nextUrl.pathname.startsWith(route))) {
    if (isAuthenticated && nextUrl.pathname === "/access") {
      return Response.redirect(
        new URL(nextUrl.searchParams.get("redirect") || "/x", nextUrl),
      )
    }

    if (!isAuthenticated && nextUrl.pathname !== "/access") {
      const redirect = nextUrl.pathname + nextUrl.search
      return Response.redirect(new URL(`/access?redirect=${redirect}`, nextUrl))
    }
  }
})

export const config = {
  matcher: ["/access", "/x/:path*"],
}
