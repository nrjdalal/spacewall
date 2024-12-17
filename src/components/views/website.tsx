export default function WebsiteView({
  data,
}: {
  data: {
    title: string
    description: string
  }
}) {
  return (
    <main className="flex h-full w-full flex-col items-center justify-center p-5">
      {data.title !== "" && (
        <h1 className="text-lg font-medium">{data.title}</h1>
      )}
      {data.description !== "" && (
        <p className="text-foreground/70 text-sm">{data.description}</p>
      )}
    </main>
  )
}
