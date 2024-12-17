import { db, websites } from "@/db"
import { auth } from "@/lib/auth"
import { and, eq } from "drizzle-orm"

export async function GET() {
  const session = await auth()

  if (!session) {
    return Response.json({
      status: 401,
      json: {
        error: "Unauthorized",
      },
    })
  }

  let res = await db
    .select()
    .from(websites)
    .where(eq(websites.userId, session.user?.id as string))

  if (!res.length) {
    res = await db
      .insert(websites)
      .values({
        userId: session.user?.id as string,
      })
      .returning()
  }

  return Response.json({
    status: 200,
    json: res[0],
  })
}

export async function POST(request: Request) {
  const body = await request.json()

  const session = await auth()

  if (!session) {
    return Response.json({
      status: 401,
      json: {
        error: "Unauthorized",
      },
    })
  }

  console.log(
    await db
      .update(websites)
      .set({
        title: body.title,
        description: body.description,
      })
      .where(
        and(
          eq(websites.userId, session.user?.id as string),
          eq(websites.id, body.id),
        ),
      )
      .returning(),
  )

  return Response.json({
    status: 200,
    message: "Success",
  })
}
