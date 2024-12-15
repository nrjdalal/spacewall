export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const slug = (await params).slug
  return <div className="capitalize">{slug.replace(/-/g, " ")}</div>
}
