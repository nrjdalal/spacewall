"use client"

import "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useQueryClient } from "@tanstack/react-query"
import { Home, Sparkle, type LucideIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect } from "react"

const applications = [
  {
    title: "Website",
    url: "/x/website",
    icon: Sparkle,
    prefetch: {
      priority: 1,
      queryKey: "website",
      apiRoute: "/api/v1/website",
    },
  },
] as {
  title: string
  url: string
  icon: LucideIcon
  prefetch?:
    | {
        priority: number
        queryKey: string
        apiRoute: string
      }
    | undefined
}[]

export function NavApplications() {
  const queryClient = useQueryClient()
  const pathname = usePathname()

  useEffect(() => {
    const prefetchApplications = async () => {
      const sortedApplications = applications
        .filter((app) => app.prefetch)
        .sort((a, b) => a.prefetch!.priority - b.prefetch!.priority)

      for (const application of sortedApplications) {
        await queryClient.prefetchQuery({
          queryKey: [application.prefetch!.queryKey],
          queryFn: async () => {
            const response = await fetch(application.prefetch!.apiRoute)
            return response.json()
          },
        })
      }
    }

    prefetchApplications()
  }, [queryClient])

  return (
    <>
      <SidebarGroup>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={pathname === "/x"}
              tooltip="Dashboard"
              asChild
            >
              <Link href={"/x"}>
                <Home />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>Applications</SidebarGroupLabel>
        <SidebarMenu>
          {applications.map((application, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton
                tooltip={application.title}
                asChild
                isActive={
                  pathname.split("/")[2] === application.url.split("/")[2]
                }
              >
                <Link href={application.url}>
                  {application.icon && <application.icon />}
                  <span>{application.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </>
  )
}
