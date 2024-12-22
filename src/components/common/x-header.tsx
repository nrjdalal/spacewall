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
    <section className="border-b py-2">
      <div className={cn("mx-auto max-w-screen-lg px-5", className)}>
        <h1 className="font-medium lg:text-lg">{title}</h1>
        {description && (
          <p className="text-foreground/60 text-xs lg:text-sm">{description}</p>
        )}
      </div>
    </section>
  )
}
