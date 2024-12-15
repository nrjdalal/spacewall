"use client"

import { Icons } from "@/assets/icons"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronLeft, ChevronRight, Crown } from "lucide-react"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must contain at least 8 characters")
    .max(32, "Password must contain at most 32 characters"),
})

export default function SignIn() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
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
            <Crown className="size-6" />
            all
          </p>
          <p className="text-primary/50 text-lg font-medium">
            Welcome, it&apos;s gonna be amazing!
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      className="mt-1.5 font-mono"
                      placeholder="hi@spacewall.me"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="absolute -bottom-5 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      className="mt-1.5 font-mono"
                      placeholder="••••••••"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="absolute -bottom-5 text-xs" />
                </FormItem>
              )}
            />

            <Button className="mt-3 h-10 w-full" type="submit">
              <span className="mt-0.5 ml-1">Continue</span> <ChevronRight />
            </Button>
          </form>
        </Form>

        <div className="flex items-center justify-between py-1">
          <Separator className="w-3/7" />
          <span className="text-foreground/50 text-xs">OR</span>
          <Separator className="w-3/7" />
        </div>

        <div className="space-y-5 sm:flex sm:gap-x-4 sm:space-y-0">
          <Button
            className="h-10 w-full"
            variant="outline"
            onClick={() => signIn("github")}
          >
            <Icons.Github className="text-foreground/50" />
            <span className="mt-0.5 ml-1">Continue with Github</span>
          </Button>

          <Button className="h-10 w-full" variant="outline">
            <Icons.Google className="text-foreground/50" />
            <span className="mt-0.5 ml-1">Continue with Google</span>
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
