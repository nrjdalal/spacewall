"use client"

import "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Home, Sparkle, type LucideIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const applications = [
  {
    title: "Website",
    url: "/x/website",
    icon: Sparkle,
    prefetch: true,
  },
] as {
  title: string
  url: string
  icon: LucideIcon
  prefetch?: boolean
}[]

export function NavApplications() {
  const pathname = usePathname()

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
                <Link href={application.url} prefetch={application.prefetch}>
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
