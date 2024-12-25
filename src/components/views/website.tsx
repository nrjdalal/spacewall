/* eslint-disable @next/next/no-img-element */

import { cn } from "@/lib/utils"
import { Crown, LinkIcon } from "lucide-react"
import Link from "next/link"

interface Blocks {
  id: string
  active: boolean
  type: string
  meta?: {
    url?: string
    title?: string
    description?: string
    image?: string
  }
}

export default function WebsiteView({
  data,
  preview = false,
}: {
  data: {
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
        "relative mx-auto min-h-dvh max-w-screen-sm pb-24 sm:pt-3",
        preview && "min-h-171",
      )}
    >
      <section className="relative grid grid-cols-1 place-items-center sm:px-3">
        <div
          className={cn(
            "relative h-36 w-full overflow-hidden",
            data.cover && "sm:rounded-md sm:border",
          )}
        >
          {data.cover && (
            <img
              className="absolute top-0 h-full w-full border-b object-cover object-center sm:border-b-0"
              src={
                "https://spacewall-dev-spacewalldev-dncvvomf.s3.us-east-1.amazonaws.com/" +
                data.cover
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
                data.image.startsWith("http")
                  ? data.image
                  : "https://spacewall-dev-spacewalldev-dncvvomf.s3.us-east-1.amazonaws.com/" +
                    data.image
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
        {data.blocks?.map((block: Blocks) => {
          if (block.type === "link") {
            return (
              <Link
                key={block.id}
                href={block.meta?.url || "/x/website"}
                target={block.meta?.url ? "_blank" : "_self"}
                className="relative grid grid-cols-6 items-center gap-1.5 rounded-md border p-1"
              >
                <div className="col-span-1">
                  {block.meta?.image ? (
                    <img
                      className="bg-secondary aspect-square h-full max-h-14 rounded-md border object-cover object-center"
                      src={
                        "https://spacewall-dev-spacewalldev-dncvvomf.s3.us-east-1.amazonaws.com/" +
                        block.meta?.image
                      }
                      alt={block.meta?.title || "Placeholder Link Title"}
                    />
                  ) : (
                    <div className="text-muted-foreground/25 grid aspect-square h-full max-h-14 place-content-center">
                      <LinkIcon className="size-6 stroke-1" />
                    </div>
                  )}
                </div>
                <div className="col-span-4 w-full text-center">
                  <h1 className="line-clamp-2 text-sm font-medium break-words">
                    {block.meta?.title || "Placeholder Link Title"}
                  </h1>
                  {block.meta?.description && (
                    <p className="text-muted-foreground text-xs">
                      {block.meta?.description}
                    </p>
                  )}
                </div>
              </Link>
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
