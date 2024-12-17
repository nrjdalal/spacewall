"use client"

import XContent from "@/components/common/x-content"
import XHeader from "@/components/common/x-header"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useQuery } from "@tanstack/react-query"
import { Edit, Image as ImageIcon, Plus } from "lucide-react"
import Image from "next/image"

export default function Page() {
  const { data } = useQuery({
    queryKey: ["website"],
    queryFn: async () => {
      const response = await fetch("/api/v1/website")
      return response.json()
    },
  })

  return (
    <>
      <XHeader
        title="Website"
        description="Think link in bio, one link, etc but for professionals."
      />
      <XContent className="lg:grid lg:grid-cols-5 lg:gap-5">
        <div className="max-w-xl lg:col-span-3">
          <div className="flex items-center space-x-3">
            <div className="bg-foreground/5 aspect-square size-24 rounded-full border">
              <div className="text-foreground/60 grid h-full w-full place-content-center">
                <ImageIcon />
              </div>
            </div>
            <div className="relative w-full">
              <Edit className="bg-foreground/5 absolute -top-0.5 right-0 size-6.5 cursor-pointer rounded-md p-1" />
              <h1 className="font-medium">{data?.json?.title || "Title"}</h1>
              <p className="text-foreground/60 text-sm">
                {data?.json?.description || "Description"}
              </p>
            </div>
          </div>

          <Button className="mt-8 h-10 w-full rounded-full">
            <Plus /> Add widget
          </Button>

          <div>
            <div className="mt-8 flex items-center space-x-3 rounded-lg border p-3">
              <div className="aspect-square size-18 rounded-lg border"></div>
              <div>
                <h1 className="font-medium">#baliVlog</h1>
                <p className="text-foreground/60 text-xs lg:text-sm">
                  A trip to Bali with my friends. It was amazing!
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="text-foreground/60 relative -m-5 hidden max-w-sm items-center justify-center rounded-lg lg:col-span-2 lg:flex">
          <Image
            className="pointer-events-none z-5 h-full w-full"
            src="/iphone.png"
            alt="preview"
            width={384}
            height={742.5}
          />
          <div className="absolute bottom-[6%] z-10 h-[84%] w-[79.75%] overflow-hidden rounded-b-3xl">
            <ScrollArea className="h-full w-full"></ScrollArea>
          </div>
        </div>
      </XContent>
    </>
  )
}
