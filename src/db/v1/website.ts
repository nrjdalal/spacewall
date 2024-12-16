import { users } from "@/db"
import { generateId } from "@/lib/utils"
import { pgTable, text } from "drizzle-orm/pg-core"

export const website = pgTable("website", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateId()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
})
