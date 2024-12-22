import { db, websites } from "@/db"
import { auth } from "@/lib/auth"
import { and, eq } from "drizzle-orm"

export async function GET() {
  const session = await auth()

  if (!session) {
    return Response.json({
      status: 401,
      message: "Unauthorized",
    })
  }

  let res = await db
    .select()
    .from(websites)
    .where(and(eq(websites.userId, session.user?.id as string)))

  if (!res.length) {
    res = await db
      .insert(websites)
      .values({
        primary: true,
        userId: session.user?.id as string,
        title: session.user?.name as string,
        image: session.user?.image as string,
      })
      .returning()
  }

  return Response.json({
    status: 200,
    data: res[0],
  })
}
