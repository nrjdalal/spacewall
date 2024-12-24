import WebsiteView from "@/components/views/website"
import { db, websiteBlocks, websites } from "@/db"
import { and, eq } from "drizzle-orm"

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const slug = (await params).slug

  const website = await db
    .select()
    .from(websites)
    .where(and(eq(websites.slug, slug)))

  const blocks = await db
    .select({
      id: websiteBlocks.id,
      type: websiteBlocks.type,
      meta: websiteBlocks.meta,
    })
    .from(websiteBlocks)
    .where(eq(websiteBlocks.websiteId, website[0].id))

  const data = {
    ...website[0],
    blocks,
    sortedBlocks: [] as BlockItem[],
  }

  interface OrderItem {
    id: string
    active: boolean
  }

  interface BlockItem {
    id: string
    type: string
    meta: unknown
  }

  const blocksMap = new Map(
    data.blocks?.map((block: BlockItem) => [block.id, block]),
  )

  // @ts-expect-error - TS doesn't know about the order property
  data.sortedBlocks = data.order.map((orderItem: OrderItem) => ({
    ...(blocksMap.get(orderItem.id) || {}),
  }))
  // .filter((orderItem: OrderItem) => orderItem.active)

  // @ts-expect-error - TS doesn't know about the order property
  return <WebsiteView data={data} />
}
