/* eslint-disable @next/next/no-img-element */

"use client"

import XHeader from "@/components/common/x-header"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import WebsiteView from "@/components/views/website"
import { availableBlocks } from "@/components/website"
import { Content, ContentPreview, ContentRoot } from "@/components/x/content"
import { ZodHookForm } from "@/components/x/zod-hook-form"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { cn } from "@/lib/utils"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Crown, ExternalLink, Loader2, Pencil, Share2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { z } from "zod"

export default function Page() {
  const [, copy] = useCopyToClipboard()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const queryClient = useQueryClient()

  const { data, isError, isLoading } = useQuery({
    queryKey: ["website"],
    queryFn: async () => {
      const res = await fetch("/api/v1/website")

      if (!res.ok)
        throw new Error("An error occurred while fetching your website")

      return (await res.json()).data
    },
  })

  const mutuation = useMutation({
    mutationFn: async (values) => {
      const res = await fetch("/api/v1/website", {
        method: "PATCH",
        body: JSON.stringify({
          websiteId: data.id,
          website: values,
        }),
      })
      return (await res.json()).data
    },
    onMutate: async (values: {
      blocks: {
        id: string
        type: string
        meta: {
          url: string
          title: string
          description: string
          image: string
        }
      }[]
    }) => {
      await queryClient.cancelQueries({
        queryKey: ["website"],
      })
      const prev = queryClient.getQueryData(["website"])
      queryClient.setQueryData(["website"], {
        ...(prev || {}),
        blocks: values.blocks,
      })
      return { prev }
    },
    onError: (err, newData, context) => {
      queryClient.setQueryData(["website"], context?.prev)
    },
  })

  // @ts-expect-error get types from dnd-kit later
  async function handleDragEnd(event) {
    const { active, over } = event
    if (active.id !== over.id) {
      const oldIndex = data.blocks.findIndex(
        (block: { id: string }) => block.id === active.id,
      )
      const newIndex = data.blocks.findIndex(
        (block: { id: string }) => block.id === over.id,
      )
      await mutuation.mutateAsync({
        blocks: arrayMove(data.blocks, oldIndex, newIndex),
      })
    }
  }

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

  const handleCopy = (text: string) => () => {
    copy(text)
      .then(() => {
        console.log("Copied!", { text })
      })
      .catch((error) => {
        console.error("Failed to copy!", error)
      })
  }

  const groupBlocksByType = (
    blocks: Array<{
      id: string
      type: string
      active: boolean
      meta?: Record<string, unknown>
    }>,
  ) => {
    return blocks.reduce(
      (
        groups: Array<{
          id: string
          type: string
          active: boolean
          meta?: Record<string, unknown>
        }>[],
        block,
      ) => {
        const lastGroup = groups[groups.length - 1]
        if (lastGroup && lastGroup[0].type === block.type) {
          lastGroup.push(block)
        } else {
          groups.push([block])
        }
        return groups
      },
      [],
    )
  }

  const groupedBlocks = groupBlocksByType(data.blocks || [])

  return (
    <>
      <XHeader
        title="Website"
        description="Creating a website has never been easier"
      />
      <ContentRoot>
        <Content className="space-y-5">
          {/* SHARE WEBSITE */}
          <section className="flex flex-wrap justify-between gap-2">
            <div className="bg-sidebar flex h-9 items-center gap-2 rounded-md border pr-2 pl-3 text-sm">
              <p>
                <span className="text-muted-foreground">
                  {process.env.NEXT_PUBLIC_SITE_URL?.split("//")[1]}/
                </span>
                {data.slug}
              </p>

              <DialogEditSlug {...data} />
            </div>
            <div className="ml-auto flex sm:gap-2">
              <Link href={"/" + data.slug} target="_blank">
                <Button
                  className="bg-sidebar rounded-r-none border-r-0 sm:rounded-md sm:border-r"
                  variant="outline"
                >
                  <ExternalLink />
                </Button>
              </Link>
              <Button
                className="bg-sidebar rounded-l-none sm:rounded-md"
                variant="outline"
                onClick={handleCopy(
                  process.env.NEXT_PUBLIC_SITE_URL + "/" + data.slug,
                )}
              >
                <Share2 className="sm:hidden" />
                <span className="hidden sm:block">Share</span>
              </Button>
            </div>
          </section>

          {/*  HEADER BLOCK */}
          <section className="bg-sidebar relative grid grid-cols-1 place-items-center rounded-md border p-3">
            <div className="bg-secondary relative h-36 w-full overflow-hidden rounded-md border">
              {data.cover ? (
                <img
                  className="absolute top-0 h-full w-full object-cover object-center"
                  src={
                    data.cover.startsWith("data:")
                      ? data.cover
                      : process.env.NEXT_PUBLIC_CDN_URL + "/" + data.cover
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
            <div className="bg-background absolute top-0 mt-24 size-24 rounded-full border object-cover object-center">
              {data.image ? (
                <img
                  className="h-full w-full rounded-full object-cover object-center"
                  src={
                    data.image.startsWith("data:")
                      ? data.image
                      : process.env.NEXT_PUBLIC_CDN_URL + "/" + data.image
                  }
                  alt={data.title}
                />
              ) : (
                <div className="text-muted-foreground/25 grid h-full w-full place-content-center">
                  <Crown />
                </div>
              )}
            </div>
            <h1 className="mt-10 text-center font-medium">
              {data.title || "Page Title"}
            </h1>
            {data.description && (
              <p className="text-muted-foreground text-center text-sm">
                {data.description}
              </p>
            )}
          </section>

          {/* ADD BLOCK */}
          <DialogAddBlock {...data} />

          {/* MANAGE BLOCKS */}
          <div className="space-y-3">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={data.blocks || []}
                strategy={verticalListSortingStrategy}
              >
                {groupedBlocks.map((group, groupIndex) =>
                  group[0].type === "social" && group.length > 1 ? (
                    <Accordion key={groupIndex} type="single" collapsible>
                      <AccordionItem
                        className="bg-sidebar min-h-14 rounded-md border px-3"
                        value="social"
                      >
                        <AccordionTrigger>Social Block</AccordionTrigger>
                        <AccordionContent className="space-y-3 pb-3">
                          {group.map((block) => {
                            const Component = availableBlocks.find(
                              (current) => current.type === block.type,
                            )?.component
                            return Component ? (
                              <Component
                                key={block.id}
                                {...block}
                                websiteId={data.id}
                              />
                            ) : null
                          })}

                          <p className="text-muted-foreground/50 text-center text-xs">
                            To place content above this block, drag the desired
                            block to the topmost position.
                            <br />
                            To add more similar blocks, click the add block
                            button and drag them here.
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ) : (
                    <div key={groupIndex} className={cn("space-y-3")}>
                      {group.map((block) => {
                        const Component = availableBlocks.find(
                          (current) => current.type === block.type,
                        )?.component
                        return Component ? (
                          <Component
                            key={block.id}
                            {...block}
                            websiteId={data.id}
                          />
                        ) : null
                      })}
                    </div>
                  ),
                )}
              </SortableContext>
            </DndContext>
          </div>
        </Content>
        <ContentPreview>
          <WebsiteView data={data} preview />
        </ContentPreview>
      </ContentRoot>
    </>
  )
}

const DialogEditSlug = (data: { id: string; slug: string }) => {
  const schema = z.object({
    slug: z.string().min(2).field({
      label: "Slug",
      default: data.slug,
    }),
  }) as z.ZodObject<z.ZodRawShape>

  const queryClient = useQueryClient()

  const mutuation = useMutation({
    mutationFn: async (values: z.infer<typeof schema>) => {
      const res = await fetch("/api/v1/website", {
        method: "PATCH",
        body: JSON.stringify({
          websiteId: data.id,
          website: values,
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
        <Button
          className="text-foreground/65 aspect-square size-6 p-0"
          variant="outline"
        >
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Slug</DialogTitle>
        </DialogHeader>
        <ZodHookForm schema={schema} onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
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
      prefix: process.env.NEXT_PUBLIC_CDN_URL + "/",
      keyprefix: `website/${data.id}/`,
      span: "1/2",
    }),
    cover: z.string().field({
      type: "file",
      label: "Cover",
      prefix: process.env.NEXT_PUBLIC_CDN_URL + "/",
      keyprefix: `website/${data.id}/`,
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
  }) as z.ZodObject<z.ZodRawShape>

  const queryClient = useQueryClient()

  const mutuation = useMutation({
    mutationFn: async (values: z.infer<typeof schema>) => {
      const valuesCopy = { ...values }
      const files = Object.keys(valuesCopy).filter((key) => {
        try {
          JSON.parse(valuesCopy[key])
          return true
        } catch {
          return false
        }
      })
      files.forEach((key) => {
        valuesCopy[key] = JSON.parse(valuesCopy[key]).key
      })
      const res = await fetch("/api/v1/website", {
        method: "PATCH",
        body: JSON.stringify({
          websiteId: data.id,
          website: valuesCopy,
        }),
      })
      return await res.json()
    },
    onMutate: async (values: z.infer<typeof schema>) => {
      const valuesCopy = { ...values }
      const files = Object.keys(valuesCopy).filter((key) => {
        try {
          JSON.parse(valuesCopy[key])
          return true
        } catch {
          return false
        }
      })
      files.forEach((key) => {
        valuesCopy[key] = JSON.parse(valuesCopy[key]).value
      })
      await queryClient.cancelQueries({
        queryKey: ["website"],
      })
      const prev = queryClient.getQueryData(["website"])
      queryClient.setQueryData(["website"], {
        ...(prev || {}),
        ...valuesCopy,
      })
      setOpen(false)
      return { prev }
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(["website"], context?.prev)
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
        <Button
          className="text-foreground/65 absolute top-3 right-3 aspect-square size-6 p-0"
          variant="outline"
        >
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Header</DialogTitle>
        </DialogHeader>
        <ZodHookForm
          schema={schema}
          onSubmit={onSubmit}
          invalidate={["website"]}
          message={{
            loading: "Updating header. Don't close the tab!",
            success: "Header updated.",
            error: "Updation failed!",
          }}
        />
      </DialogContent>
    </Dialog>
  )
}

const DialogAddBlock = (data: { id: string }) => {
  const schema = z.object({
    type: z.enum([...availableBlocks.map((block) => block.type)] as [
      string,
      ...string[],
    ]),
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
          {availableBlocks.map((block) => (
            <Button
              key={block.type}
              className="text-muted-foreground aspect-square h-full w-full border"
              variant="secondary"
              onClick={() => onClick({ type: block.type })}
            >
              {block.icon && <block.icon />} {block.title}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
