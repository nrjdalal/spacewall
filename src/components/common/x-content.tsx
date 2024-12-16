import { cn } from "@/lib/utils"

export default function XContent({
  children,
  className,
}: {
  children?: React.ReactNode
  className?: string
}) {
  return (
    <main className={cn("mx-auto w-full max-w-screen-lg p-5", className)}>
      {children}
    </main>
  )
}
