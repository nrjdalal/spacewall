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
      "mx-auto w-full max-w-screen-lg grid-cols-5 gap-5 p-5 xl:grid",
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
      "relative z-50 col-span-2 -mt-37.5 hidden max-w-sm items-start justify-center rounded-lg xl:flex",
      className,
    )}
    {...props}
  >
    <div className="fixed mt-10 h-9.5 w-84 rounded-t-full bg-black"></div>
    <div className="pointer-events-none fixed z-5">
      <Image
        className="w-105"
        src="/iphone.png"
        alt="preview"
        width={420}
        height={812}
      />
    </div>
    <div className="fixed mt-19.5 h-171.5 w-84 overflow-hidden rounded-b-4xl">
      <ScrollArea className="h-full w-full">{children}</ScrollArea>
    </div>
  </aside>
))
ContentPreview.displayName = "ContentPreview"

export { ContentRoot, Content, ContentPreview }
