import { db, websites } from "@/db"
import { eq } from "drizzle-orm"

export async function GET(request: Request) {
  const { slug } = Object.fromEntries(
    new URL(request.url).searchParams.entries(),
  )

  return Response.json({
    time: new Date(),
    ...(await db.select().from(websites).where(eq(websites.slug, slug)))[0],
  })
}
