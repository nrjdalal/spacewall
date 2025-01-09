"use server"

import { db, paymentPages } from "@/db"
import { desc, eq } from "drizzle-orm"
import { cache } from "react"

export const getPaymentPage = cache(async ({ slug }: { slug: string }) => {
  return {
    time: new Date(),
    ...(
      await db
        .select()
        .from(paymentPages)
        .where(eq(paymentPages.slug, slug))
        .orderBy(desc(paymentPages.updatedAt))
    )[0],
  }
})
