/* eslint-disable @next/next/no-img-element */

"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { ZodHookForm } from "@/components/x/zod-hook-form"
import { SiApple } from "@icons-pack/react-simple-icons"
import { Crown, ExternalLink, Mail, Phone } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { z } from "zod"

export default function Page() {
  return (
    <div className="relative mx-auto flex max-w-screen-lg flex-wrap gap-5 p-5 pt-0 pb-24">
      <div className="w-full space-y-5 py-5 lg:w-xl">
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

          <p className="text-muted-foreground flex flex-wrap gap-1 text-sm">
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

      <div className="bg-background/90 fixed bottom-0 left-0 w-screen border-t px-5 pt-5 pb-10 lg:hidden">
        <PaymentMobile />
      </div>

      <div className="right-0 hidden w-96 lg:block">
        <div className="bg-sidebar my-48 w-full max-w-96 space-y-10 rounded-md border p-5">
          <h1 className="font-medium">Complete Your Purchase</h1>
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
          <div className="-mt-6 grid place-items-center space-y-2">
            <h2 className="font-semibold">Guaranteed safe & secure payment</h2>
            <div className="flex gap-2">
              {[
                "https://raw.githubusercontent.com/aaronfagan/svg-credit-card-payment-icons/main/flat-rounded/amex.svg",
                "https://raw.githubusercontent.com/aaronfagan/svg-credit-card-payment-icons/main/flat-rounded/discover.svg",
                "https://raw.githubusercontent.com/aaronfagan/svg-credit-card-payment-icons/main/flat-rounded/mastercard.svg",
                "https://raw.githubusercontent.com/aaronfagan/svg-credit-card-payment-icons/main/flat-rounded/paypal.svg",
                "https://raw.githubusercontent.com/aaronfagan/svg-credit-card-payment-icons/main/flat-rounded/visa.svg",
              ].map((src, i) => (
                <Image
                  className="border-border/50 rounded-sm border"
                  key={i}
                  alt={
                    src.includes("mastercard")
                      ? "Mastercard"
                      : src.includes("visa")
                        ? "Visa"
                        : src.includes("amex")
                          ? "American Express"
                          : src.includes("discover")
                            ? "Discover"
                            : "PayPal"
                  }
                  src={src}
                  height={25}
                  width={40}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const PaymentMobile = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">Pay $999</Button>
      </DialogTrigger>
      <DialogContent
        onOpenAutoFocus={(e) => {
          e.preventDefault()
        }}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Payment Details</DialogTitle>
        </DialogHeader>
        <h1 className="mb-6 font-medium">Complete Your Purchase</h1>
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
        <div className="grid place-items-center space-y-2">
          <h2 className="font-semibold">Guaranteed safe & secure payment</h2>
          <div className="flex gap-2">
            {[
              "https://raw.githubusercontent.com/aaronfagan/svg-credit-card-payment-icons/main/flat-rounded/amex.svg",
              "https://raw.githubusercontent.com/aaronfagan/svg-credit-card-payment-icons/main/flat-rounded/discover.svg",
              "https://raw.githubusercontent.com/aaronfagan/svg-credit-card-payment-icons/main/flat-rounded/mastercard.svg",
              "https://raw.githubusercontent.com/aaronfagan/svg-credit-card-payment-icons/main/flat-rounded/paypal.svg",
              "https://raw.githubusercontent.com/aaronfagan/svg-credit-card-payment-icons/main/flat-rounded/visa.svg",
            ].map((src, i) => (
              <Image
                className="border-border/50 rounded-sm border"
                key={i}
                alt={
                  src.includes("mastercard")
                    ? "Mastercard"
                    : src.includes("visa")
                      ? "Visa"
                      : src.includes("amex")
                        ? "American Express"
                        : src.includes("discover")
                          ? "Discover"
                          : "PayPal"
                }
                src={src}
                height={25}
                width={40}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
