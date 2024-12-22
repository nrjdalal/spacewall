/* eslint-disable @next/next/no-img-element */

"use client"

import XHeader from "@/components/common/x-header"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import WebsiteView from "@/components/views/website"
import { Content, ContentPreview, ContentRoot } from "@/components/x/content"
import { ZodHookForm } from "@/components/x/zod-hook-form"
import { cn, createChecksum } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import Compressor from "compressorjs"
import {
  Check,
  ChevronsUpDown,
  Edit,
  Image as ImageIcon,
  Loader2,
  Trash2,
} from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
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
              <DialogContent className="flex h-full max-h-dvh w-full max-w-screen flex-col overflow-x-hidden rounded-none border-none">
                <DialogTitle className="-mx-5 border-b px-5 pb-3">
                  Preview
                </DialogTitle>
                <div className="-mx-5 -mt-4">
                  {data && <WebsiteView data={data} />}
                </div>
              </DialogContent>
            </Dialog>
            <Button
              className="w-40"
              onClick={() => {
                toast.info("Feature coming soon!")
              }}
            >
              Share
            </Button>
          </div>

          <div className="flex items-center space-x-3">
            <div className="bg-foreground/5 relative aspect-square size-24 rounded-full border">
              <EditWebsiteImage id={data?.id || ""} />
              {data?.image ? (
                <img
                  src={`https://spacewall-dev-spacewalldev-dncvvomf.s3.us-east-1.amazonaws.com/${data.image}`}
                  alt="Website Image"
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <div className="text-foreground/60 grid h-full w-full place-content-center">
                  <ImageIcon />
                </div>
              )}
            </div>
            {data?.id && (
              <div className="relative w-full">
                <EditWebsiteHeader
                  id={data?.id}
                  title={data?.title}
                  description={data?.description}
                />
                <h1 className="font-medium">{data?.title || "Title"}</h1>
                <p className="text-sm text-zinc-700 dark:text-zinc-300">
                  {data?.description || "Description"}
                </p>
              </div>
            )}
          </div>

          <AddWidget id={data?.id || ""} />

          <div className="mt-5 space-y-2">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {data?.widgets?.toReversed().map((widget: any) => (
              <div key={widget.id}>
                {widget.type === "link" && (
                  <div className="relative flex items-center space-x-3 rounded-lg border p-2">
                    <div className="bg-foreground/5 relative aspect-square size-18 rounded-lg">
                      {widget.data.image ? (
                        <img
                          src={`https://spacewall-dev-spacewalldev-dncvvomf.s3.us-east-1.amazonaws.com/${widget.data.image}`}
                          alt="Website Image"
                          className="h-full w-full rounded-lg object-cover"
                        />
                      ) : (
                        <div className="text-foreground/60 grid h-full w-full place-content-center">
                          <ImageIcon />
                        </div>
                      )}
                    </div>
                    <div className="relative w-full">
                      <h1 className="text-sm font-medium">
                        {widget.data.title}
                      </h1>
                      <p className="text-foreground/70 text-xs">
                        {widget.data.description}
                      </p>
                      <a
                        href={widget.data.url}
                        target="_blank"
                        className="text-xs text-blue-500"
                      >
                        {widget.data.url}
                      </a>
                    </div>
                    <DeleteWidget id={data.id} widgetId={widget.id} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Content>
        <ContentPreview>
          {data && <WebsiteView data={data} mobile={true} />}
        </ContentPreview>
      </ContentRoot>
    </>
  )
}

const EditWebsiteImage = ({ id }: { id: string }) => {
  const [isOpen, setIsOpen] = useState(false)

  const schema = z.object({
    image: z.unknown().field({
      type: "file",
      accept: "image/jpeg,image/png",
      label: "Image",
      className: "mt-1.5 pt-1.5",
    }),
  })

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof schema>) => {
      if (values.image instanceof FileList) {
        const orignalFile = values.image[0] as File
        let file = orignalFile

        try {
          file = await new Promise((resolve, reject) => {
            new Compressor(file, {
              width: 256,
              height: 256,
              resize: "cover",
              success(result) {
                resolve(result as File)
              },
              error(err) {
                reject(err)
              },
            })
          })

          if (orignalFile.size < file.size) file = orignalFile
        } catch {
          file = orignalFile
        }

        const signedUrl = await fetch("/api/v1/s3/upload", {
          method: "PUT",
          body: JSON.stringify({
            ContentType: file.type,
            ContentLength: file.size,
            ChecksumSHA256: await createChecksum(file),
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

        if (!res.ok) {
          return Promise.reject({
            message: "Something went wrong!",
          })
        }

        const response = await fetch("/api/v1/website", {
          method: "POST",
          body: JSON.stringify({
            image: key,
            id,
          }),
        })
        if (!response.ok)
          return Promise.reject({
            message: "Something went wrong!",
          })
        return (await response.json()).data
      }
    },
    onSuccess: (context) => {
      queryClient.setQueryData(["website"], context)
      setIsOpen(false)
    },
  })

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Edit className="bg-muted text-foreground/60 absolute top-px right-px size-6.5 cursor-pointer rounded-md border p-1" />
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
        <ZodHookForm schema={schema} onSubmit={mutation.mutateAsync} />
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
      setSubmitting(false)
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["website"],
      })
      setSubmitting(false)
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true)

    await mutation.mutateAsync(values)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Edit className="bg-muted text-foreground/60 absolute -top-1 right-0 size-6.5 cursor-pointer rounded-md border p-1" />
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

const AddWidget = ({ id }: { id: string }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const queryClient = useQueryClient()

  const types = [
    {
      label: "Link",
      value: "link",
    },
  ]

  const formSchema = z.object({
    type: z.string(),
    data: z.object({
      title: z.string().min(1),
      url: z.string().min(1),
      description: z.string().optional(),
      image: z.union([
        z.string(),
        typeof window === "undefined" ? z.any() : z.instanceof(FileList),
      ]),
    }),
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "link",
      data: {
        title: "",
        url: "",
        description: "",
        image: "",
      },
    },
  })

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await fetch("/api/v1/website", {
        method: "POST",
        body: JSON.stringify({
          id,
          widget: values,
        }),
      })
      if (!response.ok)
        return Promise.reject({
          message: "Something went wrong!",
        })
      return (await response.json()).data
    },
    onSuccess: (context) => {
      queryClient.setQueryData(["website"], context)
      setIsOpen(false)
      form.reset()
      setSubmitting(false)
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true)

    let image = values.data.image.length ? values.data.image : ""

    if (values.data.image instanceof FileList && values.data.image.length) {
      console.log(values.data.image)

      const orignalFile = values.data.image[0] as File
      let file = orignalFile

      try {
        file = await new Promise((resolve, reject) => {
          new Compressor(file, {
            width: 256,
            height: 256,
            resize: "cover",
            success(result) {
              resolve(result as File)
            },
            error(err) {
              reject(err)
            },
          })
        })

        if (orignalFile.size < file.size) file = orignalFile
      } catch {
        file = orignalFile
      }

      const signedUrl = await fetch("/api/v1/s3/upload", {
        method: "PUT",
        body: JSON.stringify({
          ContentType: file.type,
          ContentLength: file.size,
          ChecksumSHA256: await createChecksum(file),
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

      if (!res.ok) {
        return Promise.reject({
          message: "Something went wrong!",
        })
      }

      image = key
    }

    console.log(image)

    await mutation.mutateAsync({
      type: values.type,
      data: {
        ...values.data,
        image,
      },
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="mt-5 w-full rounded-full">Add widget</Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <DialogTitle>
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Widget</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "mt-1.5 justify-between pl-3",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value
                              ? types.find((type) => type.value === field.value)
                                  ?.label
                              : "Select widget"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="-mt-px p-0" align="end">
                        <Command>
                          <CommandInput placeholder="Search widgets" />
                          <CommandList>
                            <CommandEmpty>No widget found.</CommandEmpty>
                            <CommandGroup>
                              {types.map((type) => (
                                <CommandItem
                                  value={type.label}
                                  key={type.value}
                                  onSelect={() => {
                                    form.setValue("type", type.value)
                                  }}
                                >
                                  {type.label}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      type.value === field.value
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </DialogTitle>

            {form.getValues("type") === "link" && (
              <>
                <FormField
                  control={form.control}
                  name="data.title"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          className="mt-1.5"
                          placeholder="Title"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="absolute -bottom-5 text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="data.url"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel>URL</FormLabel>
                      <FormControl>
                        <Input
                          className="mt-1.5"
                          placeholder="URL"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="absolute -bottom-5 text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="data.description"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          className="mt-1.5"
                          placeholder="Description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="absolute -bottom-5 text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="data.image"
                  render={() => (
                    <FormItem className="relative">
                      <FormLabel>Image</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/jpeg,image/png"
                          className="mt-1.5 pt-1.5"
                          {...form.register("data.image")}
                        />
                      </FormControl>
                      <FormMessage className="absolute -bottom-5 text-xs" />
                    </FormItem>
                  )}
                />
              </>
            )}

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

const DeleteWidget = ({ id, widgetId }: { id: string; widgetId: string }) => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/v1/website", {
        method: "DELETE",
        body: JSON.stringify({
          id,
          widgetId,
        }),
      })
      if (!response.ok)
        return Promise.reject({
          message: "Something went wrong!",
        })
      return (await response.json()).data
    },
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["website"],
      })
      const prev = queryClient.getQueryData(["website"])
      queryClient.setQueryData(["website"], undefined)
      return { prev }
    },
    onError: (err, _newData, context) => {
      queryClient.setQueryData(["website"], context?.prev)
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["website"],
      })
    },
  })

  return (
    <Trash2
      className="bg-destructive text-background/80 dark:text-foreground/80 absolute top-2 right-2 size-6 cursor-pointer rounded-md p-1"
      onClick={() => mutation.mutate()}
    />
  )
}
