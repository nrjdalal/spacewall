import authConfig from "@/lib/auth/config"
import NextAuth from "next-auth"

const { auth } = NextAuth(authConfig)

export default auth(async function middleware(req) {
  const { auth, nextUrl } = req
  const { pathname, search, searchParams } = nextUrl

  const isAuthenticated = !!auth

  if (/^\/(access|x)(\/|$)/.test(pathname)) {
    if (isAuthenticated && pathname === "/access") {
      return redirect(searchParams.get("redirect") || "/x", nextUrl)
    }
    if (!isAuthenticated && pathname !== "/access") {
      return redirect(`/access?redirect=${pathname + search}`, nextUrl)
    }
  }
})

export const config = {
  matcher: ["/access/:path*", "/x/:path*"],
}

function redirect(url: string, base: URL) {
  return Response.redirect(new URL(url, base))
}
