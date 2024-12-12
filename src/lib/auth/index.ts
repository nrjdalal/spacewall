import { db } from "@/db"
import authConfig from "@/lib/auth/config"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import NextAuth from "next-auth"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
})
