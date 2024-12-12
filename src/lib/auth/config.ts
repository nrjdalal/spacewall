import type { NextAuthConfig } from "next-auth"
import GitHub from "next-auth/providers/github"

const authConfig = { providers: [GitHub] } satisfies NextAuthConfig

export default authConfig
