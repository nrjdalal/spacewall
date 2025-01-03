/* eslint-disable @next/next/no-img-element */

import { ViewLink } from "@/components/website/blocks/link"
import { cn } from "@/lib/utils"
import { Crown } from "lucide-react"
import Link from "next/link"
import { ViewImage } from "../website/blocks/image"

interface Blocks {
  id: string
  active: boolean
  type: string
  meta?: unknown
}

export default function WebsiteView({
  data,
  preview = false,
}: {
  data: {
    id: string
    image: string
    title: string
    description: string
    cover: string
    blocks: Blocks[]
  }
  preview?: boolean
}) {
  return (
    <main
      className={cn(
        "bg-background relative mx-auto min-h-dvh max-w-screen-sm pb-24 sm:pt-3",
        preview && "min-h-171 sm:pt-0",
      )}
    >
      <section
        className={cn(
          "relative grid grid-cols-1 place-items-center sm:px-3",
          preview && "sm:px-0",
        )}
      >
        <div
          className={cn(
            "relative h-36 w-full overflow-hidden",
            data.cover && "sm:rounded-md sm:border",
            data.cover && preview && "sm:rounded-none sm:border-none",
          )}
        >
          {data.cover && (
            <img
              className={cn(
                "absolute top-0 h-full w-full border-b object-cover object-center sm:border-b-0",
                preview && "sm:border-b",
              )}
              src={
                data.cover.startsWith("data:")
                  ? data.cover
                  : process.env.NEXT_PUBLIC_CDN_URL + "/" + data.cover
              }
              alt={data.title}
            />
          )}
        </div>
        {data.image && (
          <div
            className={cn(
              "bg-background absolute top-0 mt-24 size-24 rounded-full border object-cover object-center",
              !data.cover && "mt-12",
            )}
          >
            <img
              className="h-full w-full rounded-full object-cover object-center"
              src={
                data.image.startsWith("data:")
                  ? data.image
                  : process.env.NEXT_PUBLIC_CDN_URL + "/" + data.image
              }
              alt={data.title}
            />
          </div>
        )}
        <div
          className={cn(
            "mt-13 grid grid-cols-1 place-items-center text-center",
            !data.cover && "mt-1",
          )}
        >
          {data.title && <h1 className="px-3 font-semibold">{data.title}</h1>}
          {data.description && (
            <p className="text-muted-foreground px-3 text-sm">
              {data.description}
            </p>
          )}
        </div>
      </section>

      <div className="mt-5 space-y-3 px-3">
        {data.blocks?.map((block) => {
          if (block.type === "link") {
            return (
              <ViewLink
                websiteId={data.id}
                key={block.id}
                {...block}
                meta={
                  block.meta as {
                    title?: string
                    href?: string
                    image?: string
                    description?: string
                  }
                }
              />
            )
          }
          if (block.type === "image") {
            return (
              <ViewImage
                websiteId={data.id}
                key={block.id}
                {...block}
                meta={
                  block.meta as {
                    image?: string
                  }
                }
              />
            )
          }
        })}
      </div>

      <Link
        href={"https://spacewall.me"}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 transform items-center justify-center text-lg font-medium"
      >
        Space
        <Crown className="size-4" />
        all
      </Link>
    </main>
  )
}
