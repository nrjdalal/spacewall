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
        <header className="sticky top-0 flex h-14 shrink-0 items-center gap-2 border-b bg-inherit transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-14 md:h-16">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="fixed right-5 bottom-5 size-10 border bg-inherit md:static md:-ml-2" />
            <Separator
              orientation="vertical"
              className="mr-2 hidden h-4 md:block"
            />
            <Breadcrumb>
              <BreadcrumbList className="text-xs">
                <BreadcrumbItem
                  key="/x"
                  className={cn(
                    "hidden md:block",
                    pathname.split("/").length === 2 && "block font-medium",
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
                {pathname.split("/")[2] && (
                  <BreadcrumbSeparator className="hidden md:block" />
                )}
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
