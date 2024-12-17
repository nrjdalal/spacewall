"use client"

import XContent from "@/components/common/x-content"
import XHeader from "@/components/common/x-header"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import WebsiteView from "@/components/views/website"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Edit, Image as ImageIcon, Loader2 } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

export default function Page() {
  const { data } = useQuery({
    queryKey: ["website"],
    queryFn: async () => {
      const response = await fetch("/api/v1/website")
      return response.json()
    },
  })

  return (
    <>
      <XHeader
        title="Website"
        description="Think link in bio, one link, etc but for professionals."
      />
      <XContent className="lg:grid lg:grid-cols-5 lg:gap-5">
        <div className="max-w-xl lg:col-span-3">
          <div className="-mx-5 mb-5 flex justify-between border-b px-5 pb-5 sm:mx-0 sm:px-0">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-40" variant="outline">
                  <span className="lg:hidden">Preview</span>
                  <span className="hidden lg:block">Desktop Preview</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="flex h-full max-h-dvh w-full max-w-screen flex-col rounded-none border-none">
                <DialogTitle className="-mx-5 border-b px-5 pb-3">
                  Preview
                </DialogTitle>
                <div className="-mx-5 -mt-4">
                  {data && <WebsiteView data={data.json} />}
                </div>
              </DialogContent>
            </Dialog>
            <Button className="w-40">Share</Button>
          </div>

          <div className="flex items-center space-x-3">
            <div className="bg-foreground/5 aspect-square size-24 rounded-full border">
              <div className="text-foreground/60 grid h-full w-full place-content-center">
                <ImageIcon />
              </div>
            </div>
            {data?.json?.id && (
              <div className="relative w-full">
                <EditWebsiteHeader
                  id={data?.json?.id}
                  title={data?.json?.title}
                  description={data?.json?.description}
                />
                <h1 className="font-medium">{data?.json?.title || "Title"}</h1>
                <p className="text-foreground/70 text-sm">
                  {data?.json?.description || "Description"}
                </p>
              </div>
            )}
          </div>

          {/* <Button className="mt-8 h-10 w-full rounded-full">
            <Plus /> Add widget
          </Button> */}

          {/* <div>
            <div className="mt-8 flex items-center space-x-3 rounded-lg border p-3">
              <div className="aspect-square size-18 rounded-lg border"></div>
              <div>
                <h1 className="font-medium">#baliVlog</h1>
                <p className="text-foreground/60 text-xs lg:text-sm">
                  A trip to Bali with my friends. It was amazing!
                </p>
              </div>
            </div>
          </div> */}
        </div>
        <div className="relative -m-5 hidden max-w-sm items-center justify-center rounded-lg lg:col-span-2 lg:flex">
          <Image
            className="pointer-events-none z-5 h-full w-full"
            src="/iphone.png"
            alt="preview"
            width={384}
            height={742.5}
          />
          <div className="absolute bottom-[6%] h-[84%] w-[79.75%] overflow-hidden rounded-b-3xl">
            <ScrollArea className="mt-0.5 h-full w-full border-t">
              {data && <WebsiteView data={data.json} mobile={true} />}
            </ScrollArea>
          </div>
        </div>
      </XContent>
    </>
  )
}

const EditWebsiteHeader = ({
  id,
  title,
  description,
}: {
  id: string
  title?: string
  description?: string
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const queryClient = useQueryClient()

  const formSchema = z.object({
    title: z.string().max(64).optional(),
    description: z.string().optional(),
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: title || "",
      description: description || "",
    },
  })

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      setSubmitting(true)
      const response = await fetch("/api/v1/website", {
        method: "POST",
        body: JSON.stringify({
          ...values,
          id,
        }),
      })
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["website"],
      })
      setIsOpen(false)
      setSubmitting(false)
    },
    onError: () => {
      setSubmitting(false)
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await mutation.mutateAsync(values)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Edit className="bg-foreground/5 absolute -top-0.5 right-0 size-6.5 cursor-pointer rounded-md p-1" />
      </DialogTrigger>
      <DialogContent>
        <DialogTitle
          className={cn(
            "invisible",
            process.env.NODE_ENV === "development" && "visible",
          )}
        >
          ID: {id}
        </DialogTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input className="mt-1.5" placeholder={title} {...field} />
                  </FormControl>
                  <FormMessage className="absolute -bottom-5 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className="mt-1.5"
                      placeholder={description}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="absolute -bottom-5 text-xs" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="mt-3 h-10 w-full"
              disabled={submitting}
            >
              {submitting ? <Loader2 className="animate-spin" /> : "Submit"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
