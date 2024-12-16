export default function XHeader({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <section className="border-b py-4">
      <div className="mx-auto max-w-screen-lg space-y-2 px-5">
        <h1 className="text-xl font-medium">{title}</h1>
        {description && (
          <p className="text-foreground/50 text-sm">{description}</p>
        )}
      </div>
    </section>
  )
}
