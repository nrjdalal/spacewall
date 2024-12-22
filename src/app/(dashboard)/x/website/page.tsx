"use client"

import XHeader from "@/components/common/x-header"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Content, ContentPreview, ContentRoot } from "@/components/x/content"
import { ZodHookForm } from "@/components/x/zod-hook-form"
import { useQuery } from "@tanstack/react-query"
import { Loader2, Pencil } from "lucide-react"
import Image from "next/image"
import { z } from "zod"

export default function Page() {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["website"],
    queryFn: async () => {
      const res = await fetch("/api/v1/website")
      return (await res.json()).data
    },
  })

  if (isLoading)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    )
  if (isError)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p>
          An error occurred while fetching your website. Please try again later.
        </p>
      </div>
    )

  console.log(data)

  return (
    <>
      <XHeader
        title="Website"
        description="Think link in bio, one link, etc but for professionals."
      />
      <ContentRoot>
        <Content className="space-y-4">
          {/*  HEADER BLOCK */}
          <section className="relative grid grid-cols-1 place-items-center rounded-md border p-3">
            <DialogEditHeader {...data} />

            <Image
              className="size-24 rounded-full border"
              src={data.image}
              alt={data.title}
              height={96}
              width={96}
            />
            <h1 className="mt-3 font-medium">{data.title}</h1>
            <p className="text-muted-foreground text-sm">
              {data.description || "Add an amazing bio!"}
            </p>
          </section>

          {/* ADD BLOCK */}
          <DialogAddBlock />
        </Content>
        <ContentPreview></ContentPreview>
      </ContentRoot>
    </>
  )
}

const DialogEditHeader = (data: {
  id: string
  title: string
  description: string
  image: string
}) => {
  const schema = z.object({
    image: z.unknown().field({
      type: "file",
      label: "Image",
    }),
    title: z.string().min(1).max(128).field({
      label: "Title",
      default: data.title,
    }),
    description: z.string().max(256).field({
      type: "textarea",
      label: "Description",
      default: data.description,
    }),
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="absolute top-3 right-3 aspect-square size-6 border p-0"
          variant="secondary"
        >
          <Pencil className="text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Header</DialogTitle>
        </DialogHeader>

        <ZodHookForm schema={schema} />
      </DialogContent>
    </Dialog>
  )
}

const DialogAddBlock = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">Add Block</Button>
      </DialogTrigger>
      <DialogContent className="lg:max-w-screen-lg">
        <DialogHeader>
          <DialogTitle>Blocks</DialogTitle>
          <DialogDescription>Add blocks to your website.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-4 lg:grid-cols-6">
          <Button
            className="aspect-square h-full w-full border"
            variant="secondary"
          >
            Link
          </Button>
          <Button
            className="aspect-square h-full w-full border"
            variant="secondary"
          >
            Text
          </Button>
          <Button
            className="aspect-square h-full w-full border"
            variant="secondary"
          >
            Image
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
