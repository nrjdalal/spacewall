/* eslint-disable @next/next/no-img-element */

import { cn } from "@/lib/utils"

export default function WebsiteView({
  data,
  mobile = false,
}: {
  data: {
    image: string
    title: string
    description: string
  }
  mobile?: boolean
}) {
  return (
    <main className="flex flex-col items-center justify-center p-5">
      {data?.image !== "" && (
        <img
          src={`https://spacewall-dev-spacewalldev-dncvvomf.s3.us-east-1.amazonaws.com/${data.image}`}
          alt="Website"
          className="mb-1 size-24 rounded-full border"
        />
      )}
      {data?.title !== "" && (
        <h1 className="mt-1 text-center font-medium">{data?.title}</h1>
      )}
      {data?.description !== "" && (
        <p
          className={cn(
            "mt-1 text-center text-xs text-zinc-700 sm:text-sm dark:text-zinc-300",
            mobile && "sm:text-xs",
          )}
        >
          {data?.description}
        </p>
      )}
    </main>
  )
}
