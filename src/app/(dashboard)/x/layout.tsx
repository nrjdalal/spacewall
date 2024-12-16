"use client"

import { AppSidebar } from "@/components/sidebar/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { getSession } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const [user, setUser] = useState({
    name: "",
    email: "",
    avatar: "",
  })

  useEffect(() => {
    async function fetchData() {
      const session = await getSession()
      if (session && session.user) {
        setUser({
          name: session.user.name ?? "",
          email: session.user.email ?? "",
          avatar: session.user.image ?? "",
        })
      }
    }
    fetchData()
  }, [])

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <SidebarTrigger className="fixed right-5 bottom-5 size-10 border bg-inherit md:hidden" />
        <header className="sticky top-0 hidden h-16 shrink-0 items-center gap-2 border-b bg-inherit transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-14 md:flex">
          <SidebarTrigger className="ml-2 size-10 border" />
          <Separator className="h-4" orientation="vertical" />
          <div className="-ml-1 flex items-center gap-2">
            <Breadcrumb className="ml-1">
              <BreadcrumbList className="text-xs sm:gap-0.5">
                <BreadcrumbItem
                  key="/x"
                  className={cn(
                    pathname.split("/").length === 2 && "font-medium",
                  )}
                >
                  {pathname.split("/").length === 2 ? (
                    <BreadcrumbPage className="font-medium">
                      dashboard
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={"/x"}>dashboard</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {pathname.split("/")[2] && <BreadcrumbSeparator />}
                {pathname.split("/")[2] && (
                  <BreadcrumbItem>
                    <BreadcrumbPage className="font-medium">
                      {pathname.split("/")[2].replace(/-/g, " ")}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex min-h-[calc(100dvh-(--spacing)*14))] flex-1 flex-col">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
