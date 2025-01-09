"use client"

import XHeader from "@/components/common/x-header"
import { Content, ContentPreview, ContentRoot } from "@/components/x/content"
import { useParams } from "next/navigation"
import PaymentPageView from "../view"

export default function Page() {
  const { id } = useParams()
  console.log(id)

  return (
    <>
      <XHeader
        back="/x/payment-page"
        title="Payment Page"
        description="Manage your payment page."
      />
      <ContentRoot>
        <Content className="space-y-5 pb-32"></Content>
        <ContentPreview>
          <PaymentPageView />
        </ContentPreview>
      </ContentRoot>
    </>
  )
}
