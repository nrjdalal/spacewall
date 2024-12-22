import { users } from "@/db"
import { generateId } from "@/lib/utils"
import { boolean, jsonb, pgTable, text } from "drizzle-orm/pg-core"

export const websites = pgTable("website", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateId()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  description: text("description").notNull().default(""),
  image: text("image").notNull().default(""),
  primary: boolean("primary"),
  title: text("title").notNull().default(""),
  order: jsonb("order"),
})

export const websiteBlocks = pgTable("websiteBlock", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateId()),
  websiteId: text("websiteId")
    .notNull()
    .references(() => websites.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  meta: jsonb("meta"),
  data: jsonb("data"),
})
