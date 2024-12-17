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
      <div className={cn("mx-auto max-w-screen-lg space-y-1 px-5", className)}>
        <h1 className="text-lg font-medium lg:text-xl">{title}</h1>
        {description && (
          <p className="text-foreground/60 text-sm">{description}</p>
        )}
      </div>
    </section>
  )
}
