import { cn } from "@/lib/utils"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function XHeader({
  back,
  title,
  description,
  className,
}: {
  back?: string
  title: string
  description?: string
  className?: string
}) {
  return (
    <section className="bg-sidebar border-b py-2">
      <div className={cn("mx-auto max-w-screen-lg px-5", className)}>
        <div className="flex items-center gap-1">
          {back && (
            <Link href={back}>
              <ChevronLeft className="size-4" />
            </Link>
          )}
          <h1 className="font-medium lg:text-lg">{title}</h1>
        </div>

        {description && (
          <p className="text-foreground/60 text-xs lg:text-sm">{description}</p>
        )}
      </div>
    </section>
  )
}
