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
  <main ref={ref} className={cn("col-span-3", className)} {...props} />
))
Content.displayName = "Content"

const ContentPreview = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => (
  <aside
    ref={ref}
    className={cn(
      "relative col-span-2 -m-5 hidden max-w-sm items-center justify-center rounded-lg lg:flex",
      className,
    )}
    {...props}
  >
    <Image
      className="pointer-events-none z-5 h-full w-full"
      src="/iphone.png"
      alt="preview"
      width={384}
      height={742.5}
    />
    <div className="absolute bottom-[6%] h-[84%] w-[79.75%] overflow-hidden rounded-b-3xl">
      <ScrollArea className="mt-0.5 h-full w-full border-t">
        {children}
      </ScrollArea>
    </div>
  </aside>
))
ContentPreview.displayName = "ContentPreview"

export { ContentRoot, Content, ContentPreview }
