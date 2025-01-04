"use client"

import { NavApplications } from "@/components/sidebar/nav-applications"
import { NavModeSwitcher } from "@/components/sidebar/nav-mode-switcher"
import { NavUser } from "@/components/sidebar/nav-user"
import Support from "@/components/sidebar/support"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Box } from "lucide-react"
import * as React from "react"

const mode = {
  available: [
    {
      name: "Creator Mode",
      logo: Box,
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
        <NavModeSwitcher modes={mode.available} />
      </SidebarHeader>
      <SidebarContent>
        <NavApplications />
      </SidebarContent>
      <SidebarFooter>
        <Support user={user} />
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
