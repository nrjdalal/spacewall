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
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
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
        description="Creating a website has never been easier"
      />
      <ContentRoot>
        <Content className="space-y-5">
          <DialogAddWebsite />

          {data.map((website: { id: string; title: string; slug: string }) => (
            <Link
              key={website.id}
              href={`/x/website/${website.id}`}
              className="bg-sidebar flex h-14 flex-col items-center justify-center rounded-md border text-sm"
            >
              <span>{website.title ?? "Untitled"}</span>
              <span className="text-muted-foreground text-xs">
                spacewall.me/{website.slug}
              </span>
            </Link>
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
      label: "Website",
      default: "",
    }),
  }) as z.ZodObject<z.ZodRawShape>

  const mutuation = useMutation({
    mutationFn: async (values: z.infer<typeof schema>) => {
      const response = await fetch("/api/v1/website", {
        method: "PUT",
        body: JSON.stringify(values),
      })
      if (!response.ok) throw new Error("Something went wrong!")
      return await response.json()
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Website</DialogTitle>
        </DialogHeader>
        <ZodHookForm
          schema={schema}
          onSubmit={onSubmit}
          invalidate={["websites"]}
          message={{
            loading: "Creating website. Don't close the tab!",
            success: "Website created.",
            error: "Website name taken.",
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
