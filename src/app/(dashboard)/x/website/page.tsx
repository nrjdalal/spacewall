"use client"

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
import { Textarea } from "@/components/ui/textarea"
import WebsiteView from "@/components/views/website"
import { Content, ContentPreview, ContentRoot } from "@/components/x/content"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Edit, Image as ImageIcon, Loader2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

export default function Page() {
  const { data } = useQuery({
    queryKey: ["website"],
    queryFn: async () => {
      const response = await fetch("/api/v1/website")
      if (!response.ok)
        return Promise.reject({
          message: "Something went wrong!",
        })
      return (await response.json()).data
    },
    staleTime: Infinity,
  })

  return (
    <>
      <XHeader
        title="Website"
        description="Think link in bio, one link, etc but for professionals."
      />
      <ContentRoot>
        <Content>
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
                  {data && <WebsiteView data={data} />}
                </div>
              </DialogContent>
            </Dialog>
            <Button className="w-40">Share</Button>
          </div>

          <div className="flex items-center space-x-3">
            <div className="bg-foreground/5 relative aspect-square size-24 rounded-full border">
              <EditWebsiteImage id={data?.id || ""} image={data?.image || ""} />
              <div className="text-foreground/60 grid h-full w-full place-content-center">
                <ImageIcon />
              </div>
            </div>
            {data?.id && (
              <div className="relative w-full">
                <EditWebsiteHeader
                  id={data?.id}
                  title={data?.title}
                  description={data?.description}
                />
                <h1 className="font-medium">{data?.title || "Title"}</h1>
                <p className="text-foreground/70 text-sm">
                  {data?.description || "Description"}
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
        </Content>
        <ContentPreview>
          {data && <WebsiteView data={data} mobile={true} />}
        </ContentPreview>
      </ContentRoot>
    </>
  )
}

const EditWebsiteImage = ({ id, image }: { id: string; image: string }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const queryClient = useQueryClient()

  const formSchema = z.object({
    image: z.union([
      z.string(),
      typeof window === "undefined" ? z.any() : z.instanceof(FileList),
    ]),
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true)

    // FileList {
    //   0: File {
    //     name: 'Pan.jpg',
    //     lastModified: 1655413795000,
    //     lastModifiedDate: new Date('2022-06-16T21:09:55.000Z'),
    //     webkitRelativePath: '',
    //     size: 222880,
    //     type: 'image/jpeg'
    //   },
    //   length: 1
    // }

    if (values.image instanceof FileList) {
      const file = values.image[0] as File

      const ChecksumSHA256 = async () => {
        const buffer = await file.arrayBuffer()
        const hash = await crypto.subtle.digest("SHA-256", buffer)
        const hashArray = Array.from(new Uint8Array(hash))
        const hashHex = hashArray
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("")
        return hashHex
      }

      const signedUrl = await fetch("/api/v1/s3/upload", {
        method: "PUT",
        body: JSON.stringify({
          ContentType: file.type,
          ContentLength: file.size,
          ChecksumSHA256: await ChecksumSHA256(),
        }),
      })

      const { url, key } = await signedUrl.json()

      const res = await fetch(url, {
        method: "PUT",

        headers: {
          "Content-Type": file.type,
        },
        body: file,
      })

      if (!res.ok)
        return Promise.reject({
          message: "Something went wrong!",
        })

      await mutation.mutateAsync({
        image: key,
      })
    }
  }

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image,
    },
  })

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await fetch("/api/v1/website", {
        method: "POST",
        body: JSON.stringify({
          ...values,
          id,
        }),
      })
      if (!response.ok)
        return Promise.reject({
          message: "Something went wrong!",
        })
      return (await response.json()).data
    },
    onMutate: async (newData) => {
      await queryClient.cancelQueries({
        queryKey: ["website"],
      })
      const prev = queryClient.getQueryData(["website"])
      queryClient.setQueryData(["website"], {
        ...(prev || {}),
        ...newData,
      })
      setIsOpen(false)
      return { prev }
    },
    onError: (_err, _newData, context) => {
      queryClient.setQueryData(["website"], context?.prev)
      setSubmitting(false)
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["website"],
      })
      setSubmitting(false)
    },
  })

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Edit className="bg-foreground/5 text-foreground/60 absolute -top-1 right-0 size-6.5 cursor-pointer rounded-md p-1" />
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
              name="image"
              render={() => (
                <FormItem className="relative">
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      className="mt-1.5"
                      {...form.register("image")}
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
              {submitting ? <Loader2 className="animate-spin" /> : "Save"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
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
      if (!response.ok)
        return Promise.reject({
          message: "Something went wrong!",
        })
      return (await response.json()).data
    },
    onMutate: async (newData) => {
      await queryClient.cancelQueries({
        queryKey: ["website"],
      })
      const prev = queryClient.getQueryData(["website"])
      queryClient.setQueryData(["website"], {
        ...(prev || {}),
        ...newData,
      })
      setIsOpen(false)
      return { prev }
    },
    onError: (err, newData, context) => {
      queryClient.setQueryData(["website"], context?.prev)
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["website"],
      })
      setSubmitting(false)
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await mutation.mutateAsync(values)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Edit className="bg-foreground/5 text-foreground/60 absolute -top-1 right-0 size-6.5 cursor-pointer rounded-md p-1" />
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
              {submitting ? <Loader2 className="animate-spin" /> : "Save"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
