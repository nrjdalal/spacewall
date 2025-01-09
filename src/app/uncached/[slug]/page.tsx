import { getPaymentPage } from "./actions"

export const revalidate = 60

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const slug = (await params).slug

  const paymentPage = await getPaymentPage({
    slug,
  })

  return <pre className="p-5">{JSON.stringify(paymentPage, null, 2)}</pre>
}
