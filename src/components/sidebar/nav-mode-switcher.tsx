"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { ChevronsUpDown } from "lucide-react"
import * as React from "react"

export function NavModeSwitcher({
  modes,
}: {
  modes: {
    name: string
    logo: React.ElementType
    plan: string
  }[]
}) {
  const { isMobile, open } = useSidebar()
  const [activeTeam, setActiveTeam] = React.useState(modes[0])

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className={cn(
                "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground border",
                !open && "mt-0.75",
              )}
            >
              <div
                className={cn(
                  "bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg",
                  !open && "absolute left-0",
                )}
              >
                <activeTeam.logo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeTeam.name}
                </span>
                <span className="truncate text-xs">{activeTeam.plan}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className={cn(
              "w-[--radix-dropdown-menu-trigger-width] min-w-59.5 rounded-lg",
              isMobile && "min-w-67.5",
            )}
            align={open ? "center" : "start"}
            side="bottom"
            sideOffset={7}
          >
            {modes.map((mode) => (
              <DropdownMenuItem
                key={mode.name}
                onClick={() => setActiveTeam(mode)}
                className="cursor-pointer gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <mode.logo className="size-4 shrink-0" />
                </div>
                {mode.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
