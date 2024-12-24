import { Button } from "@/components/ui/button"
import WebsiteView from "@/components/views/website"
import { db, websiteBlocks, websites } from "@/db"
import { and, eq } from "drizzle-orm"
import { ChevronRight, Crown } from "lucide-react"
import Link from "next/link"

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

  if (website.length === 0) {
    return (
      <main className="flex min-h-dvh items-center justify-center p-7.5">
        <div className="max-w-sm space-y-6 text-center">
          <h1 className="flex items-center justify-center text-6xl font-medium">
            Space
            <Crown className="size-13" />
            all
          </h1>

          <p className="animate-bounce text-lg font-medium text-pretty uppercase italic">
            Claim your space
          </p>

          <div className="flex items-center justify-center gap-x-5 px-5">
            <Link href="/access" className="w-full">
              <Button className="h-10 w-full">
                <span className="mt-0.75">Log in</span>
                <ChevronRight />
              </Button>
            </Link>
            <Link href="mailto:admin@nrjdalal.com" className="w-full">
              <Button variant="outline" className="h-10 w-full">
                <span className="mt-0.75">Contact</span>
              </Button>
            </Link>
          </div>
        </div>
        <p className="text-primary/35 absolute bottom-4 text-center text-xs">
          Current version is for demonstration purposes only.
        </p>
      </main>
    )
  }

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
  data.sortedBlocks = data.order?.map((orderItem: OrderItem) => ({
    ...(blocksMap.get(orderItem.id) || {}),
  }))
  // .filter((orderItem: OrderItem) => orderItem.active)

  // @ts-expect-error - TS doesn't know about the order property
  return <WebsiteView data={data} />
}
