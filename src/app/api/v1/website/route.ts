import { db, websites } from "@/db"
import { auth } from "@/lib/auth"
import { and, eq, sql } from "drizzle-orm"

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
    .where(
      and(
        eq(websites.userId, session.user?.id as string),
        eq(websites.primary, true),
      ),
    )

  if (!res.length) {
    res = await db
      .insert(websites)
      .values({
        userId: session.user?.id as string,
        primary: true,
      })
      .returning()
  }

  return Response.json({
    status: 200,
    data: res[0],
  })
}

export async function POST(request: Request) {
  const data = await request.json()

  const session = await auth()

  if (!session) {
    return Response.json({
      status: 401,
      json: {
        error: "Unauthorized",
      },
    })
  }

  if (data.widget) {
    data.widgets = sql`COALESCE(widgets, '[]'::jsonb) || ${JSON.stringify(data.widget)}`
  }

  const res = await db
    .update(websites)
    .set(data)
    .where(
      and(
        eq(websites.userId, session.user?.id as string),
        eq(websites.id, data.id),
      ),
    )
    .returning()

  return Response.json({
    status: 200,
    data: res[0],
  })
}
