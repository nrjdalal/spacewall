"use client"

import { Icons } from "@/assets/icons"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ZodHookForm } from "@/components/x/zod-hook-form"
import { ChevronLeft, Crown, Loader2 } from "lucide-react"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import { z } from "zod"

export default function SignIn() {
  const [provider, setProvider] = useState<
    "email" | "github" | "google" | null
  >(null)

  async function handleSignIn(
    type: "email" | "github" | "google",
    options?: { email?: string },
  ) {
    if (provider) return
    setProvider(type)
    const res = await signIn(type, { ...options, redirect: false })
    if (res?.error) {
      console.log(res.error)
      console.log(type, type === "email")
      if (type === "email") {
        toast.info("POSTMASTER: on vacation, please use OAUTH.")
        return setProvider(null)
      }
      toast.error("An error occurred, please try different method.")
      return setProvider(null)
    }
    if (type === "email") {
      toast.success("Check your email for the magic link.")
      return setProvider(null)
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center p-7.5">
      <Link href="/">
        <Button
          variant="ghost"
          className="absolute top-5 left-1 flex items-center gap-x-2 text-base sm:left-5"
        >
          <ChevronLeft className="size-4" />
          Home
        </Button>
      </Link>

      <div className="w-full max-w-md space-y-5">
        <div className="space-y-1 pb-5">
          <p className="flex items-center text-3xl font-medium">
            Space
            <Crown className="size-7" />
            all
          </p>
          <p className="text-primary/50 text-lg font-medium">
            Welcome, it&apos;s gonna be amazing!
          </p>
        </div>

        <ZodHookForm
          schema={z.object({
            email: z
              .string()
              .email("Please enter a valid email address")
              .field({
                type: "email",
                label: "Email",
                className: "font-mono mt-1",
                placeholder: "hi@spacewall.me",
              }),
          })}
          onSubmit={async (values) => {
            await handleSignIn("email", { email: values.email })
          }}
          disabled={!!provider}
        />

        <div className="flex items-center justify-between py-1">
          <Separator className="w-3/7" />
          <span className="text-foreground/50 text-xs">OR</span>
          <Separator className="w-3/7" />
        </div>

        <div className="space-y-5 sm:flex sm:gap-x-4 sm:space-y-0">
          <Button
            className="h-10 w-full"
            disabled={!!provider}
            variant="outline"
            onClick={() => handleSignIn("github")}
          >
            {provider === "github" ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Icons.Github className="text-foreground/50" />
            )}
            <span className="ml-1">Continue with Github</span>
          </Button>

          <Button
            className="h-10 w-full"
            disabled={!!provider}
            variant="outline"
            onClick={() => handleSignIn("google")}
          >
            <Icons.Google className="text-foreground/50" />
            <span className="ml-1">Continue with Google</span>
          </Button>
        </div>

        <p className="text-primary/50 pt-1 text-center text-xs">
          By continuing, you agree to our{" "}
          <Link href="/" className="border-b">
            terms
          </Link>{" "}
          and{" "}
          <Link href="/" className="border-b">
            privacy policy
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
