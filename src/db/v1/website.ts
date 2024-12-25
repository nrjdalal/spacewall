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
  slug: text("slug")
    .notNull()
    .unique()
    .$defaultFn(() =>
      generateId({
        length: 6,
      }),
    ),
  primary: boolean("primary"),
  cover: text("cover").notNull().default(""),
  image: text("image").notNull().default(""),
  title: text("title").notNull().default(""),
  description: text("description").notNull().default(""),
  blocks: jsonb("blocks").default([]),
})
