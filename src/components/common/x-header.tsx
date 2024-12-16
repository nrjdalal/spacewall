import { cn } from "@/lib/utils"

export default function XHeader({
  title,
  description,
  className,
}: {
  title: string
  description?: string
  className?: string
}) {
  return (
    <section className="border-b py-4">
      <div className={cn("mx-auto max-w-screen-lg space-y-2 px-5", className)}>
        <h1 className="text-xl font-medium">{title}</h1>
        {description && (
          <p className="text-foreground/50 text-sm">{description}</p>
        )}
      </div>
    </section>
  )
}
