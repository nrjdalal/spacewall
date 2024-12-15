"use client"

import { NavApplications } from "@/components/sidebar/nav-applications"
import { NavModeSwitcher } from "@/components/sidebar/nav-mode-switcher"
import { NavUser } from "@/components/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { GalleryVerticalEnd } from "lucide-react"
import * as React from "react"

const data = {
  teams: [
    {
      name: "Creator Mode",
      logo: GalleryVerticalEnd,
      plan: "Free",
    },
  ],
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: {
    name: string
    email: string
    avatar: string
  }
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavModeSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavApplications />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
