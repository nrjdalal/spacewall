import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import Image from "next/image"
import * as React from "react"

const ContentRoot = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "mx-auto w-full max-w-screen-lg grid-cols-5 gap-5 p-5 lg:grid",
      className,
    )}
    {...props}
  />
))
ContentRoot.displayName = "ContentRoot"

const Content = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <main ref={ref} className={cn("col-span-3 max-w-xl", className)} {...props} />
))
Content.displayName = "Content"

const ContentPreview = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => (
  <aside
    ref={ref}
    className={cn(
      "relative col-span-2 -m-5 hidden max-w-sm items-start justify-center rounded-lg lg:flex",
      className,
    )}
    {...props}
  >
    <Image
      className="pointer-events-none fixed z-5 w-[360px] lg:top-34 xl:top-33 xl:w-[384px]"
      src="/iphone.png"
      alt="preview"
      width={384}
      height={742.5}
    />
    <div className="fixed top-51.25 h-146.5 w-72 overflow-hidden rounded-b-3xl xl:h-156.5 xl:w-76.5">
      <ScrollArea className="h-full w-full border-t">{children}</ScrollArea>
    </div>
  </aside>
))
ContentPreview.displayName = "ContentPreview"

export { ContentRoot, Content, ContentPreview }
