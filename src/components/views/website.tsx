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
        <h1 className="text-center font-medium">{data.title}</h1>
      )}
      {data.description !== "" && (
        <p className="mt-1 text-center text-sm text-zinc-700 dark:text-zinc-300">
          {data.description}
        </p>
      )}
    </main>
  )
}
