import { availableBlocks } from "@/components/website/index"
import { db, websites } from "@/db"
import { auth } from "@/lib/auth"
import { generateId } from "@/lib/utils"
import {
  DeleteObjectsCommand,
  ListObjectsV2Command,
  S3Client,
} from "@aws-sdk/client-s3"
import slugify from "@sindresorhus/slugify"
import { and, count, desc, eq, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { zodMetaParser } from "zod-meta-parser"

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

  const adminUsers = process.env.SW_ADMINS!.split(",")

  let res
  if (adminUsers.includes(session.user?.email as string)) {
    res = await db.select().from(websites).where(eq(websites.id, id))
  } else {
    res = await db
      .select()
      .from(websites)
      .where(
        and(
          eq(websites.id, id),
          eq(websites.userId, session.user?.id as string),
        ),
      )
  }

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

  const websitesCount = await db
    .select({ count: count() })
    .from(websites)
    .where(eq(websites.userId, session.user?.id as string))

  const adminUsers = process.env.SW_ADMINS!.split(",")

  if (!adminUsers.includes(session.user?.email as string)) {
    if (websitesCount[0].count >= 3) {
      return Response.json(
        {
          status: 403,
          message: "Only 3 websites are allowed in free tier",
        },
        { status: 403 },
      )
    }
  }

  const data = await request.json()
  data.slug = slugify(data.slug)

  try {
    const [{ slug }] = await db
      .insert(websites)
      .values({
        userId: session.user?.id as string,
        ...data,
      })
      .returning({
        slug: websites.slug,
      })

    revalidatePath(`/${slug}`)
  } catch (e: unknown) {
    if (
      e instanceof Error &&
      (e as { constraint_name?: string }).constraint_name ===
        "website_slug_unique"
    ) {
      return Response.json(
        {
          status: 409,
          message: "Website already exists",
        },
        {
          status: 409,
        },
      )
    }
  }

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
    .returning({
      slug: websites.slug,
    })

  revalidatePath(`/${res[0].slug}`)

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

    const [{ slug }] = await db
      .update(websites)
      .set(website)
      .where(
        and(
          eq(websites.id, websiteId),
          eq(websites.userId, session.user?.id as string),
        ),
      )
      .returning({
        slug: websites.slug,
      })

    revalidatePath(`/${slug}`)

    return Response.json({
      status: 200,
      message: "OK",
    })
  }

  if (block.meta) {
    const schema = availableBlocks.find((b) => b.type === block.type)?.schema

    if (schema) {
      const fields = zodMetaParser(schema)

      const metaStorageFields = Object.keys(fields.meta).filter((key) => {
        return (
          (fields.meta as Record<string, { _meta: { storage: boolean } }>)[key]
            ._meta.storage && !block.meta[key]
        )
      })
      const cleanupKeys = metaStorageFields.map(
        (key) => `website/${websiteId}/blocks/${block.id}/${block.type}/${key}`,
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
        prefix:
          "website/" + websiteId + "/blocks/" + block.id + "/" + block.type,
      }

      const listCommand = new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
      })

      const listResponse = await s3Client.send(listCommand)

      if (listResponse.Contents) {
        const deleteKeys = listResponse.Contents.map(
          (content) => content.Key,
        ).filter((key) => cleanupKeys.some((k) => key?.startsWith(k)))

        if (deleteKeys.length) {
          const deleteCommand = new DeleteObjectsCommand({
            Bucket: bucket,
            Delete: {
              Objects: deleteKeys.map((key) => ({ Key: key })),
            },
          })
          await s3Client.send(deleteCommand)
        }
      }
    } else {
      console.error("Error: Cleaning up storage!")
    }
  }

  if (typeof block.active === "boolean") {
    const [{ slug }] = await db
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
      .returning({
        slug: websites.slug,
      })

    revalidatePath(`/${slug}`)
  }

  if (block.meta) {
    const [{ slug }] = await db
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
      .returning({
        slug: websites.slug,
      })

    revalidatePath(`/${slug}`)
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

  const { websiteId, block, purge } = await request.json()

  const s3Client = new S3Client({
    region: process.env.S3_REGION as string,
    endpoint: process.env.S3_ENDPOINT as string,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
    },
  })

  if (purge && purge === "permanently delete") {
    const [{ slug }] = await db
      .delete(websites)
      .where(
        and(
          eq(websites.id, websiteId),
          eq(websites.userId, session.user?.id as string),
        ),
      )
      .returning({
        slug: websites.slug,
      })

    revalidatePath(`/${slug}`)

    const { bucket, prefix } = {
      bucket: process.env.S3_BUCKET_NAME as string,
      prefix: "website/" + websiteId,
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

  const [{ slug }] = await db
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
    .returning({
      slug: websites.slug,
    })

  revalidatePath(`/${slug}`)

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
