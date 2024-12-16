import { humanLogger } from "@/db/logger"
import {
  accounts,
  authenticators,
  sessions,
  users,
  verificationTokens,
} from "@/db/v1/auth"
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js"
import postgres from "postgres"

declare global {
  // eslint-disable-next-line
  var db: PostgresJsDatabase
}

let db: PostgresJsDatabase

if (process.env.NODE_ENV === "production") {
  db = drizzle({
    client: postgres(process.env.POSTGRES_URL!, {
      connect_timeout: 10000,
      idle_timeout: 30000,
      ssl: {
        rejectUnauthorized: true,
      },
    }),
  })
} else {
  if (!global.db) {
    global.db = drizzle({
      client: postgres(process.env.POSTGRES_URL!, {
        connect_timeout: 10000,
        idle_timeout: 30000,
        max: 20,
      }),
      logger: {
        logQuery: (query) => console.log(humanLogger(query)),
      },
    })
  }
  db = global.db
}

export { db, accounts, authenticators, sessions, users, verificationTokens }
