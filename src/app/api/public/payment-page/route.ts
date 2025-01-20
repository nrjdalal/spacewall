import { db, paymentPages } from "@/db"
import { eq } from "drizzle-orm"

export async function GET(request: Request) {
  const { slug } = Object.fromEntries(
    new URL(request.url).searchParams.entries(),
  )

  console.log(slug)

  return Response.json({
    time: new Date(),
    ...(
      await db.select().from(paymentPages).where(eq(paymentPages.slug, slug))
    )[0],
  })
}
