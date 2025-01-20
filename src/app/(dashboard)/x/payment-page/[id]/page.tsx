"use client"

import {
  getPaymentPage,
  updatePaymentPage,
} from "@/app/(dashboard)/x/payment-page/actions"
import PaymentPageView from "@/app/(dashboard)/x/payment-page/view"
import XHeader from "@/components/common/x-header"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Content, ContentPreview, ContentRoot } from "@/components/x/content"
import { ZodHookForm } from "@/components/x/zod-hook-form"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ExternalLink, Loader2, Pencil, Share2 } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { z } from "zod"
import { zodMetaParser } from "zod-meta-parser"

export default function Page() {
  const { id } = useParams() as { id: string }
  const [, copy] = useCopyToClipboard()

  const { data, isError, isLoading } = useQuery({
    queryKey: [`payment-page-${id}`],
    queryFn: async () => {
      return await getPaymentPage({ id })
    },
  })

  const schema = z.object({
    title: z.string().field({
      label: "Title",
      default: data?.title ?? "",
    }),
    image: z.string().field({
      type: "file",
      label: "Preview Image",
      default: data?.image ?? "",
      accept: "image/*",
      prefix: process.env.NEXT_PUBLIC_CDN_URL + "/",
      keyprefix: `payment-page/${id}/`,
    }),
    description: z.string().field({
      type: "textarea",
      label: "Description",
      default: data?.description ?? "",
      rows: 7,
    }),
  }) as z.ZodObject<z.ZodRawShape>

  const mutuation = useMutation({
    mutationFn: async (values: z.infer<typeof schema>) => {
      const fields = zodMetaParser(schema)
      const fileFields = Object.keys(fields).filter(
        (key) => fields[key]._meta.type === "file",
      )
      values = fileFields.reduce((acc, key) => {
        if (typeof values[key] === "string") {
          try {
            const parsed = JSON.parse(values[key])
            if (parsed.key) {
              acc[key] = parsed.key
            }
          } catch {
            acc[key] = values[key]
          }
        }
        return acc
      }, values)

      return await updatePaymentPage({
        id,
        ...values,
      })
    },
    onSuccess: () => {
      toast.success("Payment page updated successfully!")
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "Unknown error.")
    },
  })

  if (isLoading || isError) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        {isLoading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <p>An error occurred. Please try again later.</p>
        )}
      </div>
    )
  }

  const onSubmit = async (values: z.infer<typeof schema>) => {
    await mutuation.mutateAsync(values)
  }

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
        back="/x/payment-page"
        title="Payment Page"
        description="Manage your payment page."
      />
      <ContentRoot>
        <Content className="space-y-5 pb-32">
          {/* SHARE PAYMENT PAGE */}
          <section className="flex flex-wrap justify-between gap-2">
            <div className="bg-sidebar flex h-9 items-center gap-2 rounded-md border pr-2 pl-3 text-sm">
              <p>
                <span className="text-muted-foreground">
                  {process.env.NEXT_PUBLIC_SITE_URL?.split("//")[1]}/
                </span>
                {data?.slug}
              </p>

              {data?.id && data?.slug && (
                <DialogEditSlug id={data.id} slug={data.slug} />
              )}
            </div>
            <div className="ml-auto flex sm:gap-2">
              <Link href={"/p/" + data?.slug} target="_blank">
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
                  process.env.NEXT_PUBLIC_SITE_URL + "/p/" + data?.slug,
                )}
              >
                <Share2 className="sm:hidden" />
                <span className="hidden sm:block">Share</span>
              </Button>
            </div>
          </section>

          <ZodHookForm
            schema={schema}
            onSubmit={onSubmit}
            submitText="Save Changes"
          />
        </Content>
        <ContentPreview>
          {data && <PaymentPageView data={data} />}
        </ContentPreview>
      </ContentRoot>
    </>
  )
}

const DialogEditSlug = (data: { id: string; slug: string }) => {
  const schema = z.object({
    slug: z
      .string()
      .min(2)
      .field({
        label: "Slug",
        default: data.slug,
        prefix: process.env.NEXT_PUBLIC_SITE_URL + "/p/",
      }),
  }) as z.ZodObject<z.ZodRawShape>

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof schema>) => {
      return await updatePaymentPage({
        id: data.id,
        slug: values.slug,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`payment-page-${data.id}`],
      })
    },
  })

  const onSubmit = async (values: z.infer<typeof schema>) => {
    await mutation.mutateAsync(values)
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
      <DialogContent
        onOpenAutoFocus={(e) => {
          e.preventDefault()
        }}
      >
        <DialogHeader>
          <DialogTitle>Manage Slug</DialogTitle>
        </DialogHeader>
        <ZodHookForm schema={schema} onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  )
}
