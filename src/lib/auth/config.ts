import type { NextAuthConfig } from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"

const authConfig = {
  providers: [
    GitHub({
      allowDangerousEmailAccountLinking: true,
    }),
    Google({
      allowDangerousEmailAccountLinking: true,
    }),
  ],
} satisfies NextAuthConfig

export default authConfig
