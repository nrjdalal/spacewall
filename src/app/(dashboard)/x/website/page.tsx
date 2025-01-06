"use client"

import XHeader from "@/components/common/x-header"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Content, ContentRoot } from "@/components/x/content"
import { ZodHookForm } from "@/components/x/zod-hook-form"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Loader2, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import { z } from "zod"

export default function Page() {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["websites"],
    queryFn: async () => {
      const response = await fetch("/api/v1/website")
      if (!response.ok) throw new Error("Something went wrong!")
      return (await response.json()).data
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

  return (
    <>
      <XHeader
        title="Websites"
        description="Create and manage your websites."
      />
      <ContentRoot>
        <Content className="space-y-5">
          <DialogAddWebsite />

          {data.map((website: { id: string; title: string; slug: string }) => (
            <div key={website.id} className="relative">
              <DeleteWebsite id={website.id} />
              <Link
                href={`/x/website/${website.id}`}
                className="bg-sidebar z-0 flex h-14 flex-col items-center justify-center rounded-md border text-sm"
                prefetch={false}
              >
                <span>{website.title ?? "Untitled"}</span>
                <span className="text-muted-foreground text-xs">
                  spacewall.me/{website.slug}
                </span>
              </Link>
            </div>
          ))}
        </Content>
      </ContentRoot>
    </>
  )
}

const DialogAddWebsite = () => {
  const schema = z.object({
    title: z.string().min(1).max(128).field({
      label: "Title",
      default: "",
    }),
    slug: z.string().min(1).max(128).field({
      label: "Slug",
      description: "You can change or add custom domain later.",
      prefix: process.env.NEXT_PUBLIC_SITE_URL,
      default: "",
    }),
  }) as z.ZodObject<z.ZodRawShape>

  const mutuation = useMutation({
    mutationFn: async (values: z.infer<typeof schema>) => {
      const response = await fetch("/api/v1/website", {
        method: "PUT",
        body: JSON.stringify(values),
      })

      const json = await response.json()

      if (response.status !== 200) {
        if (json?.message) {
          throw new Error(json.message)
        }
        throw new Error("An error occurred.")
      }
      return json
    },
    onSuccess: () => {
      toast.success("Website created successfully!")
    },
    onError: (_error: unknown) => {
      toast.error(
        _error instanceof Error ? _error.message : "An error occurred.",
      )
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
        <Button className="w-full">Add Website</Button>
      </DialogTrigger>
      <DialogContent
        onOpenAutoFocus={(e) => {
          e.preventDefault()
        }}
      >
        <DialogHeader>
          <DialogTitle>New Website</DialogTitle>
        </DialogHeader>
        <ZodHookForm
          schema={schema}
          onSubmit={onSubmit}
          invalidate={["websites"]}
        />
      </DialogContent>
    </Dialog>
  )
}

const DeleteWebsite = ({ id }: { id: string }) => {
  const schema = z.object({
    purge: z.string().field({
      label: "Type 'permanently delete' to confirm",
      default: "",
    }),
  }) as z.ZodObject<z.ZodRawShape>

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof schema>) => {
      const response = await fetch(`/api/v1/website`, {
        method: "DELETE",
        body: JSON.stringify({
          websiteId: id,
          ...values,
        }),
      })

      const json = await response.json()

      if (response.status !== 200) {
        if (json?.message) {
          throw new Error(json.message)
        }
        throw new Error("An error occurred.")
      }
      return json
    },
    onSuccess: () => {
      toast.success("Website deleted successfully!")
    },
    onError: (_error: unknown) => {
      toast.error(
        _error instanceof Error ? _error.message : "An error occurred.",
      )
    },
  })

  const onSubmit = async (values: z.infer<typeof schema>) => {
    if (values.purge !== "permanently delete") {
      toast.error("Please type 'permanently delete' to confirm.")
      return
    }
    await mutation.mutateAsync(values)
  }

  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="text-destructive absolute top-1/2 right-3 aspect-square size-6 -translate-y-1/2 transform p-0"
          variant="outline"
        >
          <Trash2 />
        </Button>
      </DialogTrigger>
      <DialogContent
        onOpenAutoFocus={(e) => {
          e.preventDefault()
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-destructive">Delete Website</DialogTitle>
        </DialogHeader>
        <ZodHookForm
          schema={schema}
          onSubmit={onSubmit}
          invalidate={["websites"]}
        />
      </DialogContent>
    </Dialog>
  )
}
