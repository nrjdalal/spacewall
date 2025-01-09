import { db, paymentPages } from "@/db"
import { eq } from "drizzle-orm"

export const revalidate = 60
export const dynamicParams = true

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const slug = (await params).slug

  const [paymentPage] = await db
    .select()
    .from(paymentPages)
    .where(eq(paymentPages.slug, slug))

  return <pre className="p-5">{JSON.stringify(paymentPage, null, 2)}</pre>
}
