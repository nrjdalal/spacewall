import PaymentPageView from "@/app/(dashboard)/x/payment-page/view"

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const slug = (await params).slug

  const paymentPage = await (
    await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/public/payment-page?slug=${slug}`,
      {
        next: {
          revalidate: Infinity,
        },
      },
    )
  ).json()

  return <PaymentPageView data={paymentPage} preview={false} />
}
