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
    name: z.string().field({
      label: "Name",
      default: data?.name,
    }),
    title: z.string().field({
      label: "Title",
      default: data?.title ?? "",
    }),
  }) as z.ZodObject<z.ZodRawShape>

  const mutuation = useMutation({
    mutationFn: async (values: z.infer<typeof schema>) => {
      return await updatePaymentPage({
        id,
        name: values.name,
        slug: values.slug,
        title: values.title,
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
