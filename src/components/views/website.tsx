/* eslint-disable @next/next/no-img-element */

import { cn } from "@/lib/utils"
import { LinkIcon } from "lucide-react"
import Link from "next/link"

export default function WebsiteView({
  data,
  preview = false,
}: {
  data: {
    image: string
    title: string
    description: string
    cover: string
    sortedBlocks: {
      id: string
      active: boolean
      type: string
      meta: {
        url: string
        title: string
        description: string
        image: string
      }
    }[]
  }
  preview?: boolean
}) {
  return (
    <main className={cn("min-h-dvh", preview && "min-h-171")}>
      <section className="grid grid-cols-1 place-items-center">
        <div className="relative h-36 w-full overflow-hidden">
          {data.cover && (
            <img
              className="absolute top-0 h-full w-full border-b object-cover object-center"
              src={
                "https://spacewall-dev-spacewalldev-dncvvomf.s3.us-east-1.amazonaws.com/" +
                data.cover
              }
              alt={data.title}
            />
          )}
        </div>
        {data.image && (
          <div className="bg-background absolute top-0 mt-24 size-24 rounded-full border object-cover object-center">
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
        <div className="mt-13 grid grid-cols-1 place-items-center">
          {data.title && <h1 className="px-3 font-medium">{data.title}</h1>}
          {data.description && (
            <p className="text-muted-foreground px-3 text-sm">
              {data.description}
            </p>
          )}
        </div>
      </section>

      <div className="mt-5 space-y-3 px-3">
        {data.sortedBlocks?.map(
          (block: {
            id: string
            active: boolean
            type: string
            meta: {
              url: string
              title: string
              description: string
              image: string
            }
          }) => {
            if (block.type === "link") {
              return (
                <Link
                  key={block.id}
                  href={block.meta?.url || "/x/website"}
                  target={block.meta?.url ? "_blank" : "_self"}
                  className="relative flex items-center gap-3 rounded-md border p-2"
                >
                  <div className="bg-secondary grid aspect-square size-16 place-items-center rounded-md border">
                    {block.meta?.image ? (
                      <img
                        className="h-full w-full rounded-md object-cover object-center"
                        src={
                          "https://spacewall-dev-spacewalldev-dncvvomf.s3.us-east-1.amazonaws.com/" +
                          block.meta?.image
                        }
                        alt={block.meta?.title || "Placeholder Link Title"}
                      />
                    ) : (
                      <div className="text-muted-foreground/25 grid h-full w-full place-content-center">
                        <LinkIcon />
                      </div>
                    )}
                  </div>

                  <div className="grid w-full grid-cols-12">
                    <div className="col-span-11 text-center">
                      <h1 className="text-sm font-medium">
                        {block.meta?.title || "Placeholder Link Title"}
                      </h1>
                      {block.meta?.description && (
                        <p className="text-muted-foreground text-xs">
                          {block.meta?.description}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              )
            }
          },
        )}
      </div>
    </main>
  )
}
