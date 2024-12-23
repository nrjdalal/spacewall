/* eslint-disable @next/next/no-img-element */

import { cn } from "@/lib/utils"
import { Crown, ImageIcon } from "lucide-react"
import Link from "next/link"

export default function WebsiteView({
  data,
  mobile = false,
}: {
  data: {
    image: string
    title: string
    description: string
    widgets: unknown[]
  }
  mobile?: boolean
}) {
  return (
    <main
      className={cn(
        "mx-auto flex w-full max-w-screen-sm flex-col items-center justify-center p-5",
        mobile && "p-3",
      )}
    >
      {data?.image !== "" && (
        <img
          src={`https://spacewall-dev-spacewalldev-dncvvomf.s3.us-east-1.amazonaws.com/${data.image}`}
          alt="Website"
          className="size-24 rounded-full border"
        />
      )}
      {data?.title !== "" && (
        <h1
          className={cn(
            "mt-2 text-center font-medium sm:text-lg",
            mobile && "sm:text-base",
          )}
        >
          {data?.title}
        </h1>
      )}
      {data?.description !== "" && (
        <p
          className={cn(
            "text-center text-xs text-zinc-700 sm:text-sm dark:text-zinc-300",
            mobile && "sm:text-xs",
          )}
        >
          {data?.description}
        </p>
      )}

      <div
        className={cn(
          "mt-5 w-full space-y-2 overflow-hidden",
          mobile && "w-66 xl:w-70.5",
        )}
      >
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {data?.widgets?.toReversed().map((widget: any) => (
          <div key={widget.id}>
            {widget.type === "link" && (
              <Link href={widget.data.url} target="_blank">
                <div className="flex min-h-17 items-center space-x-3 rounded-lg border p-2">
                  <div
                    className={cn(
                      "bg-foreground/5 relative aspect-square size-16 rounded-lg border lg:size-18",
                      mobile && "lg:size-16",
                      widget.data.image === "" && "hidden",
                    )}
                  >
                    {widget.data.image ? (
                      <img
                        src={`https://spacewall-dev-spacewalldev-dncvvomf.s3.us-east-1.amazonaws.com/${widget.data.image}`}
                        alt="Website Image"
                        className="h-full w-full rounded-lg object-cover"
                      />
                    ) : (
                      <div className="text-foreground/60 grid h-full w-full place-content-center">
                        <ImageIcon />
                      </div>
                    )}
                  </div>
                  <div className="relative w-full">
                    <h1
                      className={cn(
                        "text-sm font-medium sm:text-base",
                        mobile && "sm:text-sm",
                      )}
                    >
                      {widget.data.title}
                    </h1>
                    <p
                      className={cn(
                        "text-foreground/70 text-xs sm:text-sm",
                        mobile && "sm:text-xs",
                      )}
                    >
                      {widget.data.description}
                    </p>
                  </div>
                </div>
              </Link>
            )}
          </div>
        ))}
      </div>

      <Link
        href="https://spacewall.me"
        target="_blank"
        className="mt-196 flex items-center py-5 text-xl font-medium"
      >
        Space
        <Crown className="size-5" />
        all
      </Link>
    </main>
  )
}
