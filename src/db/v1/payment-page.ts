import { users } from "@/db"
import { generateId } from "@/lib/utils"
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const paymentPages = pgTable("paymentPage", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateId()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  title: text("title"),
  image: text("image"),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").$onUpdateFn(() => new Date()),
})
