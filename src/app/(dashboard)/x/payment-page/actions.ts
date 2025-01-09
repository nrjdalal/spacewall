"use server"

import { db, paymentPages } from "@/db"
import { auth } from "@/lib/auth"
import { and, eq } from "drizzle-orm"
import { z } from "zod"
import { fromError } from "zod-validation-error"

const schema = z.object({
  id: z.string().nonempty(),
  slug: z.string().nonempty(),
  name: z.string().nonempty(),
  title: z.string().nullable(),
  // required for deletion confirmation
  purge: z.literal("permanently delete").optional(),
})

const withSession = async <T>(
  data?: T,
  validator?: z.ZodType<T>,
): Promise<{ userId: string; data?: T }> => {
  if (data && validator) {
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
}

export const getPaymentPage = async (data: Pick<PaymentPage, "id">) => {
  const { userId } = await withSession(data, schema.pick({ id: true }))
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
  const { userId } = await withSession(
    data,
    schema.pick({ slug: true, name: true }),
  )
  return await db.insert(paymentPages).values({
    userId,
    ...data,
  })
}

export const updatePaymentPage = async (
  data: Pick<PaymentPage, "id" | "slug" | "name" | "title">,
) => {
  const { userId } = await withSession(
    data,
    schema.pick({ id: true, slug: true, name: true, title: true }),
  )
  try {
    await db
      .update(paymentPages)
      .set(data)
      .where(and(eq(paymentPages.id, data.id), eq(paymentPages.userId, userId)))
  } catch (error) {
    console.log(error)
  }
  return await db
    .update(paymentPages)
    .set(data)
    .where(and(eq(paymentPages.id, data.id), eq(paymentPages.userId, userId)))
}

export const deletePaymentPage = async (
  data: Pick<PaymentPage, "id" | "purge">,
) => {
  const { userId } = await withSession(
    data,
    schema.pick({ id: true, purge: true }),
  )
  return await db
    .delete(paymentPages)
    .where(and(eq(paymentPages.id, data.id), eq(paymentPages.userId, userId)))
}

type PaymentPage = z.infer<typeof schema>
export type { PaymentPage }
