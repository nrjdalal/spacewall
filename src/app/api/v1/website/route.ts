import { db, websites } from "@/db"
import { auth } from "@/lib/auth"
import { generateId } from "@/lib/utils"
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
    data.widgets = sql`COALESCE(widgets, '[]'::jsonb) || ${JSON.stringify({
      id: generateId(),
      ...data.widget,
    })}`
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

export async function DELETE(request: Request) {
  try {
    const data = await request.json()

    // Ensure the user is authenticated
    const session = await auth()
    if (!session) {
      return Response.json(
        {
          error: "Unauthorized",
        },
        { status: 401 },
      )
    }

    // Validate required fields
    if (!data.widgetId || !data.id) {
      return Response.json(
        {
          error: "Missing required fields: `widgetId` and `id`",
        },
        { status: 400 },
      )
    }

    // Update the `widgets` JSONB column, removing the widget with the specified `id`
    const res = await db
      .update(websites)
      .set({
        widgets: sql`COALESCE(
          (
            SELECT jsonb_agg(elem)
            FROM jsonb_array_elements(widgets) elem
            WHERE elem->>'id' != ${data.widgetId}
          ),
          '[]'::jsonb
        )`,
      })
      .where(
        and(
          eq(websites.userId, session.user?.id as string), // Ensure the widget belongs to the user
          eq(websites.id, data.id), // Ensure the correct `websites` entry is targeted
        ),
      )
      .returning()

    // Check if any rows were affected
    if (res.length === 0) {
      return Response.json(
        {
          error: "Widget not found or no changes made",
        },
        { status: 404 },
      )
    }

    // Success response
    return Response.json(
      {
        message: "Widget deleted successfully",
        data: res[0],
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error in DELETE /widgets:", error)
    return Response.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}
