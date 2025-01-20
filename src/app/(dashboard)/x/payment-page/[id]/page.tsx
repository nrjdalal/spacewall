"use client"

import {
  getPaymentPage,
  updatePaymentPage,
} from "@/app/(dashboard)/x/payment-page/actions"
import PaymentPageView from "@/app/(dashboard)/x/payment-page/view"
import XHeader from "@/components/common/x-header"
import { Content, ContentPreview, ContentRoot } from "@/components/x/content"
import { ZodHookForm } from "@/components/x/zod-hook-form"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import { z } from "zod"
import { zodMetaParser } from "zod-meta-parser"

export default function Page() {
  const { id } = useParams() as { id: string }

  const { data, isError, isLoading } = useQuery({
    queryKey: [`payment-page-${id}`],
    queryFn: async () => {
      return await getPaymentPage({ id })
    },
  })

  const schema = z.object({
    slug: z.string().field({
      label: "Slug",
      default: data?.slug,
    }),
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

  return (
    <>
      <XHeader
        back="/x/payment-page"
        title="Payment Page"
        description="Manage your payment page."
      />
      <ContentRoot>
        <Content className="space-y-5 pb-32">
          <div className="bg-sidebar rounded-md border p-5 py-10">
            <ZodHookForm
              schema={schema}
              onSubmit={onSubmit}
              submitText="Save Changes"
            />
          </div>
        </Content>
        <ContentPreview>
          {data && <PaymentPageView data={data} />}
        </ContentPreview>
      </ContentRoot>
    </>
  )
}
