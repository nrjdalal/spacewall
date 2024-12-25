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
import WebsiteView from "@/components/views/website"
import { Content, ContentPreview, ContentRoot } from "@/components/x/content"
import { ZodHookForm } from "@/components/x/zod-hook-form"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
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
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  Camera,
  Crown,
  ExternalLink,
  GripHorizontal,
  GripVertical,
  LinkIcon,
  Loader2,
  Pencil,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { z } from "zod"

function SortableItem({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  // Disable body scrolling on drag start for touch devices
  const handleTouchStart = () => {
    document.body.style.overflow = "hidden" // Disable scrolling for body
  }

  // Re-enable body scrolling when dragging ends
  const handleTouchEnd = () => {
    document.body.style.overflow = "" // Restore default body scrolling
  }

  useEffect(() => {
    // Attach global listeners for touchend
    document.addEventListener("touchend", handleTouchEnd)

    return () => {
      // Cleanup listeners to prevent memory leaks
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [])

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <div
        {...listeners}
        {...attributes}
        className="text-muted-foreground absolute -top-3 left-1/2 z-5 -translate-x-1/2 transform cursor-grab sm:top-1/2 sm:bottom-auto sm:-left-3 sm:-translate-y-1/2 sm:translate-x-0"
        onTouchStart={handleTouchStart}
      >
        <GripHorizontal className="sm:hidden" />
        <GripVertical className="hidden sm:block" />
      </div>
      {children}
    </div>
  )
}

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
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["website"],
      })
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

  return (
    <>
      <XHeader
        title="Website"
        description="Creating a website has never been easier"
      />
      <ContentRoot>
        <Content className="space-y-5">
          {/* SHARE WEBSITE */}
          <section className="flex justify-between">
            <div className="flex h-9 items-center gap-2 rounded-md border pr-2 pl-3 text-sm">
              <p>
                <span className="text-muted-foreground">
                  {process.env.NEXT_PUBLIC_SITE_URL?.split("//")[1]}/
                </span>
                {data.slug}
              </p>

              <DialogEditSlug {...data} />
            </div>
            <div className="flex gap-2">
              <Link href={"/" + data.slug} target="_blank">
                <Button variant="outline">
                  <ExternalLink />
                </Button>
              </Link>
              <Button
                className="px-6"
                variant="outline"
                onClick={handleCopy(
                  process.env.NEXT_PUBLIC_SITE_URL + "/" + data.slug,
                )}
              >
                Share
              </Button>
            </div>
          </section>

          {/*  HEADER BLOCK */}
          <section className="relative grid grid-cols-1 place-items-center rounded-md border p-3">
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

              <DialogEditHeader {...data} />
            </div>
            <div className="bg-background absolute top-0 mt-24 size-24 rounded-full border object-cover object-center">
              {data.image ? (
                <img
                  className="h-full w-full rounded-full object-cover object-center"
                  src={
                    "https://spacewall-dev-spacewalldev-dncvvomf.s3.us-east-1.amazonaws.com/" +
                    data.image
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
            <p className="text-muted-foreground text-center text-sm">
              {data.description || "Page Description / Bio"}
            </p>
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
                {data.blocks?.map(
                  (block: {
                    id: string
                    type: string
                    active: boolean
                    meta: {
                      url: string
                      title: string
                      description: string
                      image: string
                    }
                  }) => {
                    if (block.type === "link") {
                      return (
                        <SortableItem id={block.id} key={block.id}>
                          <div
                            key={block.id}
                            className="relative grid grid-cols-6 items-center gap-1.5 rounded-md border p-1"
                          >
                            <DialogEditBlockLink
                              {...block}
                              websiteId={data.id}
                            />
                            <div className="col-span-1">
                              {block.meta?.image ? (
                                <img
                                  className="bg-secondary aspect-square h-full max-h-14 rounded-md border object-cover object-center"
                                  src={
                                    "https://spacewall-dev-spacewalldev-dncvvomf.s3.us-east-1.amazonaws.com/" +
                                    block.meta?.image
                                  }
                                  alt={block.meta?.title}
                                />
                              ) : (
                                <div className="text-muted-foreground/25 grid aspect-square h-full max-h-14 place-content-center">
                                  <Camera className="size-6 stroke-1" />
                                </div>
                              )}
                            </div>
                            <div className="col-span-4 w-full text-center">
                              <h1 className="line-clamp-2 text-sm font-medium break-words">
                                {block.meta?.title || "Link Block"}
                              </h1>
                              {block.meta?.description && (
                                <p className="text-muted-foreground text-xs">
                                  {block.meta?.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </SortableItem>
                      )
                    }
                  },
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
  })

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
        {/* @ts-expect-error will fix later */}
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
      console.log(values)

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
        {/* @ts-expect-error will fix later */}
        <ZodHookForm schema={schema} onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  )
}

const DialogAddBlock = (data: { id: string }) => {
  const availableBlocks = [
    {
      type: "link",
      title: "Link",
      icon: LinkIcon,
    },
  ] as const

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

const DialogEditBlockLink = (data: {
  id: string
  websiteId: string
  meta: {
    url: string
    title: string
    description: string
    image: string
  }
}) => {
  const schema = z.object({
    title: z
      .string()
      .min(1)
      .max(128)
      .field({
        label: "Title",
        default: data.meta?.title || "",
      }),
    url: z
      .string()
      .url()
      .field({
        label: "URL",
        default: data.meta?.url || "",
      }),
    description: z
      .string()
      .max(256)
      .field({
        type: "textarea",
        label: "Description",
        default: data.meta?.description || "",
      }),
    image: z.string().field({
      type: "file",
      label: "Image",
      default: data.meta?.image || "",
      prefix:
        "https://spacewall-dev-spacewalldev-dncvvomf.s3.us-east-1.amazonaws.com/",
    }),
  })

  const queryClient = useQueryClient()

  const mutuation = useMutation({
    mutationFn: async (values: z.infer<typeof schema>) => {
      const res = await fetch("/api/v1/website", {
        method: "PATCH",
        body: JSON.stringify({
          websiteId: data.websiteId,
          block: {
            id: data.id,
            meta: values,
          },
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

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/v1/website", {
        method: "DELETE",
        body: JSON.stringify({
          websiteId: data.websiteId,
          block: {
            id: data.id,
          },
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="text-foreground/65 absolute top-1/2 right-3 aspect-square size-6 -translate-y-1/2 transform p-0"
          variant="outline"
        >
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Link</DialogTitle>
        </DialogHeader>
        {/* @ts-expect-error will fix later */}
        <ZodHookForm schema={schema} onSubmit={onSubmit} />
        <Button
          variant="destructive"
          onClick={async () => {
            await deleteMutation.mutateAsync()
            setOpen(false)
          }}
        >
          Delete
        </Button>
      </DialogContent>
    </Dialog>
  )
}
