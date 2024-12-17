export default function WebsiteView({
  data,
}: {
  data: {
    title: string
    description: string
  }
}) {
  return (
    <main className="flex flex-col items-center justify-center p-5">
      {data.title !== "" && (
        <h1 className="text-center text-lg font-medium">{data.title}</h1>
      )}
      {data.description !== "" && (
        <p className="text-foreground/70 text-center text-sm">
          {data.description}
        </p>
      )}
    </main>
  )
}
