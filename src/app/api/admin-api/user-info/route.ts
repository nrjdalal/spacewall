import { db, websites } from "@/db"
import { auth } from "@/lib/auth"
import { eq } from "drizzle-orm"

export async function GET(request: Request) {
  const { id } = Object.fromEntries(new URL(request.url).searchParams.entries())

  console.log(id)

  const session = await auth()

  if (!session) {
    return Response.json({
      status: 401,
      message: "Unauthorized",
    })
  }

  const _websites = await db
    .select({
      id: websites.id,
      slug: websites.slug,
    })
    .from(websites)
    .where(eq(websites.userId, id))

  return Response.json({
    status: 200,
    data: {
      websites: _websites,
    },
  })
}
