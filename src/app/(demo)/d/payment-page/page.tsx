/* eslint-disable @next/next/no-img-element */

"use client"

import { Separator } from "@/components/ui/separator"
import { ZodHookForm } from "@/components/x/zod-hook-form"
import { SiApple } from "@icons-pack/react-simple-icons"
import { Crown, ExternalLink, Mail, Phone } from "lucide-react"
import Link from "next/link"
import { z } from "zod"

export default function Page() {
  return (
    <div className="mx-auto grid max-w-screen-xl grid-cols-1 p-5 pt-0 lg:grid-cols-12">
      <div className="mr-5 space-y-5 p-5 lg:col-span-8">
        {/* header */}
        <div className="flex w-full items-center gap-2">
          <SiApple className="size-8" />
          <h1 className="mt-1 text-xl font-medium">Apple</h1>
        </div>

        <Separator className="mb-12" />

        <h1 className="text-lg font-medium">iPhone 16 Pro</h1>
        <img
          src="https://www.apple.com/v/iphone-16-pro/d/images/overview/apple-intelligence/apple_intelligence_endframe__ksa4clua0duu_xlarge.jpg"
          className="aspect-square max-h-96 rounded-md border object-cover object-top"
          alt=""
        />

        <p className="text-muted-foreground text-sm">
          The iPhone 16 Pro is a smartphone designed and marketed by Apple Inc.
          It is the fourteenth generation of the iPhone, succeeding the iPhone
          15 Pro and iPhone 15 Pro Max, and was announced on September 14, 2025.
        </p>

        <Separator className="mt-12" />

        <div className="text-muted-foreground text-xs">
          You agree to share information entered on this page with Apple (owner
          of this page) and SpaceWall, adhering to applicable laws.
        </div>

        <div className="space-y-3">
          <h1 className="font-medium">Contact Us</h1>
          <div className="text-muted-foreground space-y-2">
            <p className="flex items-center gap-2 text-sm">
              <Mail className="size-5" /> support@apple.com
            </p>
            <p className="flex items-center gap-2 text-sm">
              <Phone className="size-5" /> +1 800 275 2273
            </p>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col space-y-2">
          <Link
            href="/"
            className="flex items-center gap-1 text-lg select-none"
          >
            <Crown className="mb-px size-5" /> SpaceWalll
          </Link>

          <p className="text-muted-foreground flex gap-1 text-sm">
            Want to create page like this? Visit{" "}
            <span className="flex items-center gap-1 text-blue-500">
              SpaceWall Payment Pages
              <ExternalLink className="mb-px size-3" />
            </span>{" "}
            to get started.
          </p>
        </div>
      </div>
      {/* payment info */}
      <div className="flex h-min justify-center lg:col-span-4 lg:mt-48">
        <div className="bg-sidebar w-full max-w-96 space-y-10 rounded-md border p-5">
          <h1 className="font-medium">Payment Details</h1>
          <ZodHookForm
            schema={z.object({
              fullname: z.string().field({
                placeholder: "Full Name",
                default: "",
              }),
              email: z.string().field({
                placeholder: "Email",
                default: "",
              }),
              phone: z.string().field({
                placeholder: " Phone",
                prefix: "+91",
                default: "",
              }),
            })}
            submitText="Pay $999"
          />
        </div>
      </div>
    </div>
  )
}
