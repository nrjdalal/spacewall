/* eslint-disable @next/next/no-img-element */

import { cn } from "@/lib/utils"

export default function WebsiteView({
  data,
  preview = false,
}: {
  data: {
    image: string
    title: string
    description: string
    cover: string
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
    </main>
  )
}
