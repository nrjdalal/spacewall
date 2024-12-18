import { users } from "@/db"
import { generateId } from "@/lib/utils"
import { boolean, pgTable, text } from "drizzle-orm/pg-core"

export const websites = pgTable("website", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateId()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  primary: boolean("primary"),
  image: text("image").notNull().default(""),
  title: text("title").notNull().default(""),
  description: text("description").notNull().default(""),
})
