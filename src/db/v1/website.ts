import { users } from "@/db"
import { generateId } from "@/lib/utils"
import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const websites = pgTable("website", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateId()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  cover: text("cover").notNull().default(""),
  image: text("image").notNull().default(""),
  blocks: jsonb("blocks"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
})
