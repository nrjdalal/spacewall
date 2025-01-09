"use server"

import { db, paymentPages } from "@/db"
import { auth } from "@/lib/auth"
import { and, desc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { fromError } from "zod-validation-error"

const schema = z.object({
  id: z.string().nonempty(),
  slug: z.string().nonempty(),
  name: z.string().nonempty(),
  title: z.string().nullable(),
  image: z
    .string()
    .nullable()
    .describe(JSON.stringify({ storage: true })),
  description: z.string().nullable(),
  // non-schema fields
  userId: z.string().nonempty(),
  purge: z.literal("permanently delete").optional(),
})

const withSession = async <T>(data?: T): Promise<{ userId: string }> => {
  if (data) {
    const validator = schema.partial()
    const result = validator.safeParse(data)
    if (!result.success) {
      throw new Error(fromError(result.error).toString())
    }
  }

  const session = await auth()
  if (!session) {
    throw new Error("Unauthorized")
  }

  return { userId: session.user.id }
}

export const getPaymentPages = async () => {
  const { userId } = await withSession()
  return await db
    .select()
    .from(paymentPages)
    .where(eq(paymentPages.userId, userId))
    .orderBy(desc(paymentPages.updatedAt))
}

export const getPaymentPage = async (data: Pick<PaymentPage, "id">) => {
  const { userId } = await withSession(data)
  return (
    await db
      .select()
      .from(paymentPages)
      .where(and(eq(paymentPages.id, data.id), eq(paymentPages.userId, userId)))
  )[0]
}

export const createPaymentPage = async (
  data: Pick<PaymentPage, "slug" | "name">,
) => {
  const { userId } = await withSession(data)
  return await db.insert(paymentPages).values({
    userId,
    slug: data.slug,
    name: data.name,
  })
}

export const updatePaymentPage = async (
  data: Partial<PaymentPage> & Pick<PaymentPage, "id">,
) => {
  const { userId } = await withSession(data)
  const result = await db
    .update(paymentPages)
    .set(data)
    .where(and(eq(paymentPages.id, data.id), eq(paymentPages.userId, userId)))
    .returning({
      slug: paymentPages.slug,
    })
  revalidatePath(`/payment-page/${result[0].slug}`)
  return true
}

export const deletePaymentPage = async (
  data: Partial<PaymentPage> & Pick<PaymentPage, "id">,
) => {
  const { userId } = await withSession(data)
  return await db
    .delete(paymentPages)
    .where(and(eq(paymentPages.id, data.id), eq(paymentPages.userId, userId)))
}

type PaymentPage = z.infer<typeof schema>
export type { PaymentPage }
