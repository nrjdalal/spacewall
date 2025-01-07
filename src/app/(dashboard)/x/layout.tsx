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
        <SidebarTrigger className="bg-sidebar fixed right-5 bottom-5 z-50 size-10 border md:hidden" />
        <header className="bg-sidebar sticky top-0 z-45 hidden h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-14 md:flex">
          <SidebarTrigger className="z-50 ml-2 size-10 border" />
          <Separator className="h-4" orientation="vertical" />
          <div className="-ml-1 flex items-center gap-2">
            <Breadcrumb className="ml-1">
              <BreadcrumbList className="text-xs sm:gap-0.5">
                {pathname.split("/").map((segment, index, array) => {
                  const href = `/${array.slice(1, index + 1).join("/")}`
                  const isLast = index === array.length - 1
                  return (
                    <div key={href} className="flex items-center">
                      {index > 1 && <BreadcrumbSeparator />}
                      <BreadcrumbItem>
                        {isLast ? (
                          <BreadcrumbPage className="font-medium">
                            {segment.replace(/-/g, " ")}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link href={href}>
                              {segment.replace(/-/g, " ")}
                            </Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </div>
                  )
                })}
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
