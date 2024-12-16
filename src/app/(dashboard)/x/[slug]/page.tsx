import XHeader from "@/components/common/x-header"

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const slug = (await params).slug

  return (
    <XHeader
      title={slug.replace(/-/g, " ")}
      description="If you're seeing this, something amazing is about to release soon! Stay tuned!"
    />
  )
}
