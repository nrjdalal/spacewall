"use client"

import {
  createPaymentPage,
  deletePaymentPage,
  getPaymentPages,
} from "@/app/(dashboard)/x/payment-page/actions"
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
    queryKey: ["payment-pages"],
    queryFn: async () => {
      return await getPaymentPages()
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
          An error occurred while fetching your payment pages. Please try again
          later.
        </p>
      </div>
    )

  return (
    <>
      <XHeader
        title="Payment Pages"
        description="Create and manage your payment pages."
      />
      <ContentRoot>
        <Content className="space-y-5">
          <DialogAddWebsite />

          {data?.map(
            (website: { id: string; slug: string; title: string | null }) => (
              <div key={website.id} className="relative">
                <DeleteWebsite id={website.id} />
                <Link
                  href={`/x/payment-page/${website.id}`}
                  className="bg-sidebar z-0 flex h-14 flex-col items-center justify-center rounded-md border text-sm"
                  prefetch={false}
                >
                  <span>{website.title ?? "Untitled"}</span>
                  <span className="text-muted-foreground text-xs">
                    spacewall.me/p/{website.slug}
                  </span>
                </Link>
              </div>
            ),
          )}
        </Content>
      </ContentRoot>
    </>
  )
}

const DialogAddWebsite = () => {
  const schema = z.object({
    slug: z
      .string()
      .min(1)
      .max(128)
      .field({
        label: "Slug",
        description: "You can change or add custom domain later.",
        prefix: process.env.NEXT_PUBLIC_SITE_URL + "/p/",
        default: "",
      }),
    title: z.string().min(1).max(128).field({
      label: "Title",
      default: "",
    }),
  }) as z.ZodObject<z.ZodRawShape>

  const mutuation = useMutation({
    mutationFn: async (values: z.infer<typeof schema>) => {
      const response = await createPaymentPage({
        slug: values.slug,
        title: values.title,
      })

      return response
    },
    onSuccess: () => {
      toast.success("Payment page created successfully!")
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "Unknown error.")
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
        <Button className="w-full">New Payment Page</Button>
      </DialogTrigger>
      <DialogContent
        onOpenAutoFocus={(e) => {
          e.preventDefault()
        }}
      >
        <DialogHeader>
          <DialogTitle>New Payment Page</DialogTitle>
        </DialogHeader>
        <ZodHookForm
          schema={schema}
          onSubmit={onSubmit}
          submitText="Create"
          invalidate={["payment-pages"]}
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
      return await deletePaymentPage({
        id,
        purge: values.purge,
      })
    },
    onSuccess: () => {
      toast.success("Payment page deleted successfully!")
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "Unknown error.")
    },
  })

  const onSubmit = async (values: z.infer<typeof schema>) => {
    if (values.purge !== "permanently delete") {
      toast.error("Please type 'permanently delete' to confirm.")
      return
    }
    await mutation.mutateAsync(values)
    setOpen(false)
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
          invalidate={["payment-pages"]}
        />
      </DialogContent>
    </Dialog>
  )
}
