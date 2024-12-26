import { db, websites } from "@/db"
import { auth } from "@/lib/auth"
import { deleteObject } from "@/lib/s3"
import { generateId } from "@/lib/utils"
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

  return Response.json({
    status: 200,
    data: res[0],
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

  const res = await db
    .update(websites)
    .set({
      blocks: sql`${JSON.stringify({
        id: generateId(),
        active: false,
        type: data.type,
      })}::jsonb || COALESCE(${websites.blocks}, '[]'::jsonb)`,
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
    data: res[0],
  })
}

export async function PATCH(request: Request) {
  const session = await auth()

  if (!session) {
    return Response.json(
      {
        status: 401,
        message: "Unauthorized",
      },
      { status: 401 },
    )
  }

  const { websiteId, website, block } = await request.json()

  if (website) {
    const bucketFiles = ["image", "cover"] as const

    if (bucketFiles.some((field) => website?.[field])) {
      const existingData = await db
        .select(
          Object.fromEntries(
            bucketFiles.map((field) => [field, websites[field]]),
          ),
        )
        .from(websites)
        .where(
          and(
            eq(websites.id, websiteId),
            eq(websites.userId, session.user?.id as string),
          ),
        )

      for (const field of bucketFiles) {
        if (website?.[field] && existingData[0]?.[field] !== website[field]) {
          deleteObject(existingData[0][field])
        }
      }
    }

    const res = await db
      .update(websites)
      .set(website)
      .where(
        and(
          eq(websites.id, websiteId),
          eq(websites.userId, session.user?.id as string),
        ),
      )
      .returning()

    return Response.json({
      status: 200,
      data: res[0],
    })
  }

  const res = await db
    .update(websites)
    .set({
      blocks: sql`
          (
            SELECT jsonb_agg(
              CASE
                WHEN block->>'id' = ${block.id}
                THEN jsonb_set(block, '{meta}', ${JSON.stringify({ ...block.meta })}::jsonb, true)
                ELSE block
              END
            )
            FROM jsonb_array_elements(${websites.blocks}) AS block
          )
        `,
    })
    .where(
      and(
        eq(websites.id, websiteId),
        eq(websites.userId, session.user?.id as string),
      ),
    )
    .returning()

  return Response.json({
    status: 200,
    data: res[0],
  })
}

export async function DELETE(request: Request) {
  const session = await auth()

  if (!session) {
    return Response.json({
      status: 401,
      message: "Unauthorized",
    })
  }

  const { websiteId, block } = await request.json()

  const existingData = await db
    .select({
      block: sql<{ type: string; meta?: { image?: string } }>`(
      SELECT block
      FROM jsonb_array_elements(${websites.blocks}) AS block
      WHERE block->>'id' = ${block.id}
    )`,
    })
    .from(websites)
    .where(
      and(
        eq(websites.id, websiteId),
        eq(websites.userId, session.user?.id as string),
      ),
    )

  console.log(existingData[0]?.block)

  if (existingData[0]?.block?.type === "link") {
    if (existingData[0]?.block?.meta?.image) {
      deleteObject(existingData[0]?.block?.meta?.image)
    }
  }

  const res = await db
    .update(websites)
    .set({
      blocks: sql`(
        SELECT jsonb_agg(block)
        FROM jsonb_array_elements(COALESCE(${websites.blocks}, '[]'::jsonb)) AS block
        WHERE block->>'id' != ${block.id}
      )`,
    })
    .where(
      and(
        eq(websites.id, websiteId),
        eq(websites.userId, session.user?.id as string),
      ),
    )
    .returning()

  return Response.json({
    status: 200,
    data: res[0],
  })
}
