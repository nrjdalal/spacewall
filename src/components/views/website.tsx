/* eslint-disable @next/next/no-img-element */

import { cn } from "@/lib/utils"
import { Crown } from "lucide-react"

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
      <section className="relative grid grid-cols-1 place-items-center rounded-md p-3">
        <div className="bg-secondary relative h-36 w-full overflow-hidden rounded-md border">
          {data.cover ? (
            <img
              className="absolute top-0 h-full w-full object-cover object-center"
              src={
                "https://spacewall-dev-spacewalldev-dncvvomf.s3.us-east-1.amazonaws.com/" +
                data.cover
              }
              alt={data.title}
            />
          ) : (
            <>
              <p className="absolute left-1/3 flex h-full w-max -translate-x-2/3 -rotate-15 transform items-start justify-center text-7xl font-medium opacity-2.5">
                Space
                <Crown className="size-16" />
                all
              </p>
              <p className="absolute left-1/2 flex h-full w-max -translate-x-1/2 -rotate-15 transform items-center justify-center text-7xl font-medium opacity-2.5">
                Space
                <Crown className="size-16" />
                all
              </p>
              <p className="absolute left-2/3 flex h-full w-max -translate-x-1/3 -rotate-15 transform items-end justify-center text-7xl font-medium opacity-2.5">
                Space
                <Crown className="size-16" />
                all
              </p>
            </>
          )}
        </div>
        <img
          className="bg-secondary absolute top-0 mt-24 size-24 rounded-full border object-cover object-center"
          src={
            data.image.startsWith("http")
              ? data.image
              : "https://spacewall-dev-spacewalldev-dncvvomf.s3.us-east-1.amazonaws.com/" +
                data.image
          }
          alt={data.title}
        />
        <h1 className="mt-10 font-medium">{data.title}</h1>
        <p className="text-muted-foreground text-sm">
          {data.description || "Add an amazing bio!"}
        </p>
      </section>
    </main>
  )
}
