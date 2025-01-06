import { db, websites } from "@/db"
import { auth } from "@/lib/auth"
import { generateId } from "@/lib/utils"
import {
  DeleteObjectsCommand,
  ListObjectsV2Command,
  S3Client,
} from "@aws-sdk/client-s3"
import slugify from "@sindresorhus/slugify"
import { and, desc, eq, sql } from "drizzle-orm"

export async function GET(request: Request) {
  const { id } = Object.fromEntries(new URL(request.url).searchParams.entries())

  const session = await auth()

  if (!session) {
    return Response.json({
      status: 401,
      message: "Unauthorized",
    })
  }

  if (!id) {
    const res = await db
      .select({
        id: websites.id,
        slug: websites.slug,
        image: websites.image,
        title: websites.title,
      })
      .from(websites)
      .where(eq(websites.userId, session.user?.id as string))
      .orderBy(desc(websites.updatedAt))

    return Response.json({
      status: 200,
      data: res,
    })
  }

  const res = await db
    .select()
    .from(websites)
    .where(
      and(eq(websites.id, id), eq(websites.userId, session.user?.id as string)),
    )

  return Response.json({
    status: 200,
    data: res[0],
  })
}

export async function PUT(request: Request) {
  const session = await auth()

  if (!session) {
    return Response.json({
      status: 401,
      message: "Unauthorized",
    })
  }

  const data = await request.json()

  data.slug = slugify(data.slug)

  await db.insert(websites).values({
    userId: session.user?.id as string,
    ...data,
  })

  return Response.json({
    status: 200,
    message: "OK",
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
    if (website.slug) {
      website.slug = slugify(website.slug)
    }

    website.updatedAt = new Date()

    await db
      .update(websites)
      .set(website)
      .where(
        and(
          eq(websites.id, websiteId),
          eq(websites.userId, session.user?.id as string),
        ),
      )

    return Response.json({
      status: 200,
      message: "OK",
    })
  }

  if (typeof block.active === "boolean") {
    await db
      .update(websites)
      .set({
        blocks: sql`
          (
            SELECT jsonb_agg(
              CASE
                WHEN block->>'id' = ${block.id}
                THEN jsonb_set(block, '{active}', ${JSON.stringify(block.active)}::jsonb, true)
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
  }

  if (block.meta) {
    await db
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
  }

  return Response.json({
    status: 200,
    message: "OK",
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

  await db
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

  const s3Client = new S3Client({
    region: process.env.S3_REGION as string,
    endpoint: process.env.S3_ENDPOINT as string,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
    },
  })

  const { bucket, prefix } = {
    bucket: process.env.S3_BUCKET_NAME as string,
    prefix: "website/" + websiteId + "/blocks/" + block.id,
  }

  const listCommand = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: prefix,
  })
  const listResponse = await s3Client.send(listCommand)

  if (listResponse.Contents) {
    const deleteCommand = new DeleteObjectsCommand({
      Bucket: bucket,
      Delete: {
        Objects: listResponse.Contents.map((content) => ({
          Key: content.Key,
        })),
      },
    })
    await s3Client.send(deleteCommand)
  }

  return Response.json({
    status: 200,
    message: "OK",
  })
}
