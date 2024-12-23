import { db, websiteBlocks, websites } from "@/db"
import { auth } from "@/lib/auth"
import { and, eq, sql } from "drizzle-orm"

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
      })
      .returning()
  }

  const blocks = await db
    .select({
      id: websiteBlocks.id,
      type: websiteBlocks.type,
      meta: websiteBlocks.meta,
    })
    .from(websiteBlocks)
    .where(eq(websiteBlocks.websiteId, res[0].id))

  return Response.json({
    status: 200,
    data: {
      ...res[0],
      blocks,
    },
  })
}

export async function POST(request: Request) {
  const session = await auth()

  if (!session) {
    return Response.json({
      status: 401,
      message: "Unauthorized",
    })
  }

  const data = await request.json()

  const blockId = (
    await db
      .insert(websiteBlocks)
      .values({
        websiteId: data.websiteId,
        type: data.type,
      })
      .returning({
        id: websiteBlocks.id,
      })
  )[0].id

  await db
    .update(websites)
    .set({
      order: sql`COALESCE("order", '[]'::jsonb) || ${JSON.stringify({
        id: blockId,
        active: false,
      })}`,
    })
    .where(
      and(
        eq(websites.id, data.websiteId),
        eq(websites.userId, session.user?.id as string),
      ),
    )
    .returning()

  return Response.json({
    status: 200,
  })
}

export async function PATCH(request: Request) {
  const session = await auth()

  if (!session) {
    return Response.json({
      status: 401,
      message: "Unauthorized",
    })
  }

  const data = await request.json()

  if (data.websiteId) {
    await db
      .update(websites)
      .set(data)
      .where(
        and(
          eq(websites.id, data.websiteId),
          eq(websites.userId, session.user?.id as string),
        ),
      )
      .returning()

    return Response.json({
      status: 200,
    })
  }

  if (data.blockId) {
    await db
      .update(websiteBlocks)
      .set(data)
      .where(and(eq(websiteBlocks.id, data.blockId)))
      .returning()

    return Response.json({
      status: 200,
    })
  }
}

export async function DELETE(request: Request) {
  const session = await auth()

  if (!session) {
    return Response.json({
      status: 401,
      message: "Unauthorized",
    })
  }

  const data = await request.json()

  if (data.blockId) {
    await db.delete(websiteBlocks).where(eq(websiteBlocks.id, data.blockId))
    return Response.json({
      status: 200,
    })
  }
}
