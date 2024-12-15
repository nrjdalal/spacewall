import {
  accounts,
  authenticators,
  db,
  sessions,
  users,
  verificationTokens,
} from "@/db"
import authConfig from "@/lib/auth/config"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { eq } from "drizzle-orm"
import NextAuth from "next-auth"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
    authenticatorsTable: authenticators,
  }),
  session: { strategy: "jwt" },
  ...authConfig,
  pages: {
    signIn: "/access",
  },
  callbacks: {
    async jwt({ token, user }) {
      const [dbUser] = await db
        .select({
          id: users.id,
        })
        .from(users)
        .where(eq(users.email, token.email!))
        .limit(1)

      return {
        id: dbUser.id || user.id,
        ...token,
      }
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
      }
      return session
    },
  },
})
