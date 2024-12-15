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
        <header className="sticky top-0 flex h-14 shrink-0 items-center gap-2 border-b bg-inherit transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-14 md:h-16">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem key="/x" className="hidden md:block">
                  <BreadcrumbLink asChild>
                    <Link href={"/x"}>Dashboard</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {pathname.split("/")[2] && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbPage className="capitalize">
                      {pathname.split("/")[2].replace(/-/g, " ")}
                    </BreadcrumbPage>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex min-h-dvh flex-1 p-5 pt-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
