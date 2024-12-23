/* eslint-disable @next/next/no-img-element */

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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  Crown,
  ImageIcon,
  LetterText,
  LinkIcon,
  Loader2,
  Pencil,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
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

  data.sortedBlocks = data.order?.map((orderItem: OrderItem) => ({
    ...orderItem,
    ...(blocksMap.get(orderItem.id) || {}),
  }))

  return (
    <>
      <XHeader
        title="Website"
        description="Think link in bio, one link, etc but for professionals."
      />
      <ContentRoot>
        <Content className="space-y-5">
          {/*  HEADER BLOCK */}
          <section className="relative grid grid-cols-1 place-items-center rounded-md border p-3">
            <div className="bg-secondary relative h-36 w-full overflow-hidden rounded-md border">
              {data.cover ? (
                <img
                  className="absolute top-0 h-full w-full object-cover"
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

              <DialogEditHeader {...data} />
            </div>
            <img
              className="absolute top-0 mt-24 size-24 rounded-full border"
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

          {/* ADD BLOCK */}
          <DialogAddBlock {...data} />

          {/* MANAGE BLOCKS */}
          <div className="space-y-3">
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
                    <section
                      key={block.id}
                      className="relative flex items-center gap-3 rounded-md border p-2"
                    >
                      <Button className="absolute top-3 right-3 aspect-square size-6 border p-0">
                        <Pencil />
                      </Button>

                      <div className="bg-secondary grid aspect-square size-16 place-items-center rounded-md">
                        <LinkIcon className="text-muted-foreground" />
                      </div>

                      <div className="grid w-full grid-cols-12">
                        <div className="col-span-11 text-center">
                          <h1 className="text-sm font-medium">
                            {block.meta?.title || "Placeholder Link Title"}
                          </h1>
                          <p className="text-muted-foreground text-xs">
                            {block.meta?.description ||
                              "Placeholder description (optional)"}
                          </p>
                          <Link
                            href={block.meta?.url || "/"}
                            className="text-xs text-blue-500 italic"
                          >
                            {block.meta?.url || "placeholder.link"}
                          </Link>
                        </div>
                      </div>
                    </section>
                  )
                }
              },
            )}
          </div>
        </Content>
        <ContentPreview></ContentPreview>
      </ContentRoot>
    </>
  )
}

const DialogEditHeader = (data: {
  id: string
  image: string
  cover: string
  title: string
  description: string
}) => {
  const schema = z.object({
    image: z.string().field({
      type: "file",
      label: "Image",
      default: data.image,
      prefix:
        "https://spacewall-dev-spacewalldev-dncvvomf.s3.us-east-1.amazonaws.com/",
      span: "1/2",
    }),
    cover: z.string().field({
      type: "file",
      label: "Cover",
      prefix:
        "https://spacewall-dev-spacewalldev-dncvvomf.s3.us-east-1.amazonaws.com/",
      default: data.cover,
      span: "1/2",
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

  const queryClient = useQueryClient()

  const mutuation = useMutation({
    mutationFn: async (values: z.infer<typeof schema>) => {
      const res = await fetch("/api/v1/website", {
        method: "PATCH",
        body: JSON.stringify({
          websiteId: data.id,
          ...values,
        }),
      })
      return await res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["website"],
      })
    },
  })

  const onSubmit = async (values: z.infer<typeof schema>) => {
    await mutuation.mutateAsync(values)
    setOpen(false)
  }

  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="absolute top-3 right-3 aspect-square size-6 border p-0">
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Header</DialogTitle>
        </DialogHeader>
        {/* @ts-expect-error will fix later */}
        <ZodHookForm schema={schema} onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  )
}

const DialogAddBlock = (data: { id: string }) => {
  const availableBlocks = ["link", "text", "image"] as const

  const schema = z.object({
    type: z.enum(availableBlocks),
  })

  const queryClient = useQueryClient()

  const mutuation = useMutation({
    mutationFn: async (values: z.infer<typeof schema>) => {
      const res = await fetch("/api/v1/website", {
        method: "POST",
        body: JSON.stringify({
          websiteId: data.id,
          ...values,
        }),
      })
      return await res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["website"],
      })
    },
  })

  async function onClick(values: z.infer<typeof schema>) {
    await mutuation.mutateAsync(schema.parse(values))
    setOpen(false)
  }

  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            className="text-muted-foreground aspect-square h-full w-full border"
            variant="secondary"
            onClick={() => onClick({ type: "link" })}
          >
            <LinkIcon />
            Link
          </Button>
          <Button
            className="text-muted-foreground aspect-square h-full w-full border"
            variant="secondary"
            onClick={() => onClick({ type: "text" })}
          >
            <LetterText />
            Text
          </Button>
          <Button
            className="text-muted-foreground aspect-square h-full w-full border"
            variant="secondary"
            onClick={() => onClick({ type: "image" })}
          >
            <ImageIcon />
            Image
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
