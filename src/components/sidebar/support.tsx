"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { ZodHookForm } from "@/components/x/zod-hook-form"
import { MessageSquare } from "lucide-react"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { z } from "zod"

export default function Support({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const currentPath = usePathname()

  const [open, setOpen] = useState(false)

  const schema = z.object({
    subject: z.string().min(1).field({
      label: "Subject",
      default: "",
    }),
    message: z.string().min(1).field({
      type: "textarea",
      label: "Message",
      default: "",
    }),
    url: z.string().field({
      label: "URL (optional)",
      default: process.env.NEXT_PUBLIC_SITE_URL + currentPath,
    }),
    attachment: z.string().field({
      type: "file",
      label: "Attachment (optional)",
      default: "",
      prefix: process.env.NEXT_PUBLIC_CDN_URL + "/",
      keyprefix: `support/attachment/${user.email}/`,
    }),
  }) as z.ZodObject<z.ZodRawShape>

  const onSubmit = async (values: z.infer<typeof schema>) => {
    await fetch("/api/v1/support", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
    setOpen(false)
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <SidebarMenuButton tooltip="Support">
              <MessageSquare />
              Support
            </SidebarMenuButton>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Support</DialogTitle>
              <DialogDescription>
                Request a feature, report a bug, or just say hi!
              </DialogDescription>
            </DialogHeader>
            <ZodHookForm
              schema={schema}
              onSubmit={onSubmit}
              message={{
                loading: "Uploading attachment. Please wait!",
                success: "Message sent! We'll get back to you soon.",
                error: "An error occurred. Please try again.",
              }}
            />
          </DialogContent>
        </Dialog>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
