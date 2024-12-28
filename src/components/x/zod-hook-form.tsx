/* eslint-disable @next/next/no-img-element */

"use client"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useFileUpload } from "@/hooks/use-image-upload"
import { cn, createChecksum } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import Compressor from "compressorjs"
import { File, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const formFieldSchema = z
  .object({
    type: z
      .enum(["email", "file", "password", "select", "text", "textarea"])
      .default("text"),
    default: z.string().optional(),
    label: z.string().optional(),
    description: z.string().optional(),
    options: z.record(z.string()).optional(),
    span: z.enum(["1/2", "1/3", "2/3", "1/4", "2/4", "3/4"]).optional(),
    className: z.string().optional(),
    placeholder: z.string().optional(),
    prefix: z.string().optional(),
    keyprefix: z.string().optional(),
  })
  .passthrough()
  .superRefine((data) => {
    if (
      ["email", "file", "password", "select", "text", "textarea"].includes(
        data.type,
      )
    ) {
      data.default = data.default ?? ""
    }
  })

const describeField = (describe?: Partial<z.infer<typeof formFieldSchema>>) => {
  return JSON.stringify(formFieldSchema.parse(describe ?? {}))
}

declare module "zod" {
  interface ZodType {
    field(describe: unknown): this
  }
}

z.ZodType.prototype.field = function (describe) {
  return this.describe(
    describeField(describe as Partial<z.infer<typeof formFieldSchema>>),
  )
}

export const ZodHookForm = ({
  className,
  schema,
  onSubmit,
  invalidate = [],
  disabled = false,
  message,
}: {
  className?: string
  schema: z.ZodObject<z.ZodRawShape>
  onSubmit?: (values: z.infer<typeof schema>) => Promise<void> | void
  invalidate?: string[]
  disabled?: boolean
  message?: {
    loading: string
    success: string
    error: string
  }
}) => {
  const queryClient = useQueryClient()

  const data = [
    ...Object.entries(schema?.shape).map(([key, value]) => ({
      name: key,
      ...formFieldSchema.parse(JSON.parse(value?._def.description ?? "{}")),
    })),
  ]

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: Object.fromEntries(
      data.map((item) => [item.name, item.default]),
    ),
  })

  const { fileState, handleFilePreview } = useFileUpload()

  const submit = async (values: z.infer<typeof schema>) => {
    const uploadPromises = Object.keys(fileState).map(async (key) => {
      const state = fileState[key]
      if (!state.file) return null

      try {
        if (state.file.type.startsWith("image/")) {
          try {
            const compressedFile = await new Promise<File>(
              (resolve, reject) => {
                new Compressor(state.file, {
                  quality: 0.9,
                  height: 1080,
                  width: 1080,
                  success(result) {
                    resolve(result as File)
                  },
                  error(err) {
                    reject(err)
                  },
                })
              },
            )

            if (compressedFile.size < state.file.size)
              state.file = compressedFile
          } catch (err) {
            console.error("Image compression failed:", err)
          }
        }

        const checksum = await createChecksum(state.file)

        const signedUrlResponse = await fetch("/api/v1/s3/upload", {
          method: "PUT",
          body: JSON.stringify({
            Key: values[key],
            ContentType: state.file.type,
            ContentLength: state.file.size,
            ChecksumSHA256: checksum,
          }),
        })

        if (!signedUrlResponse.ok) throw new Error("Failed to fetch signed URL")

        const { url } = await signedUrlResponse.json()

        const uploadResponse = await fetch(url, {
          method: "PUT",
          headers: { "Content-Type": state.file.type },
          body: state.file,
        })

        if (!uploadResponse.ok) throw new Error("File upload failed")

        return values[key]
      } catch (err) {
        console.error(`Failed to upload file for field "${key}":`, err)
        throw err
      }
    })

    try {
      if (onSubmit) {
        const actions = async () => {
          await onSubmit(values)
          await Promise.all(uploadPromises)
          await queryClient.invalidateQueries({
            queryKey: invalidate,
          })
        }

        if (message) {
          return toast.promise(actions(), {
            loading: message.loading,
            success: message.success,
            error: message.error,
          })
        }

        return actions()
      } else {
        console.log(values)
      }

      form.reset()
    } catch (err) {
      console.error("File upload or form submission failed:", err)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submit)}
        className={cn("grid grid-cols-12 gap-5", className)}
      >
        {data.map((formField) => {
          return (
            <FormField
              key={formField.name}
              control={form.control}
              name={formField.name}
              render={({ field }) => (
                <FormItem
                  className={cn(
                    "relative",
                    formField.span === "1/2"
                      ? "col-span-6"
                      : formField.span === "1/3"
                        ? "col-span-4"
                        : formField.span === "2/3"
                          ? "col-span-8"
                          : formField.span === "1/4"
                            ? "col-span-3"
                            : formField.span === "2/4"
                              ? "col-span-6"
                              : formField.span === "3/4"
                                ? "col-span-9"
                                : "col-span-12",
                  )}
                >
                  {formField.label ? (
                    <FormLabel>
                      {formField.label}
                      <Separator className="invisible h-0.5" />
                    </FormLabel>
                  ) : (
                    <FormLabel className="sr-only">{formField.name}</FormLabel>
                  )}

                  {["email", "password", "text"].includes(formField.type) && (
                    <FormControl>
                      <Input
                        {...formField}
                        {...field}
                        value={
                          field.value as
                            | string
                            | number
                            | readonly string[]
                            | undefined
                        }
                      />
                    </FormControl>
                  )}

                  {formField.type === "file" && (
                    <>
                      <FormControl>
                        <Input
                          className={cn("hidden", formField.className)}
                          {...formField}
                          onChange={(event) =>
                            handleFilePreview({
                              event,
                              key: formField.name,
                              setValue: form.setValue,
                              keyprefix: formField.keyprefix ?? "",
                            })
                          }
                        />
                      </FormControl>
                      <FormLabel
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault()
                          const files = e.dataTransfer.files
                          if (files.length > 0) {
                            handleFilePreview({
                              event: {
                                target: { files },
                              } as unknown as React.ChangeEvent<HTMLInputElement>,
                              key: formField.name,
                              setValue: form.setValue,
                              keyprefix: formField.keyprefix ?? "",
                            })
                          }
                        }}
                      >
                        <div className="h-24 w-full cursor-pointer overflow-hidden rounded-md border focus:bg-red-500">
                          {!fileState[formField.name]?.preview &&
                            (formField.default ? (
                              <img
                                src={
                                  formField.default.startsWith("data:")
                                    ? formField.default
                                    : process.env.NEXT_PUBLIC_CDN_URL +
                                      "/" +
                                      formField.default
                                }
                                alt="Preview"
                                className="aspect-square h-full w-full object-contain object-center"
                              />
                            ) : (
                              <div className="text-muted-foreground flex h-full w-full items-center justify-center text-center">
                                Select a file
                                <br />
                                or
                                <br />
                                Drag & drop here
                              </div>
                            ))}
                          {typeof fileState[formField.name]?.preview ===
                            "string" && (
                            <img
                              src={fileState[formField.name]?.preview as string}
                              alt="Preview"
                              className="aspect-square h-full w-full object-contain object-center"
                            />
                          )}
                          {typeof fileState[formField.name]?.preview ===
                            "boolean" &&
                            fileState[formField.name]?.preview && (
                              <div className="flex h-full w-full items-center justify-center">
                                <File className="size-12 stroke-1" />
                              </div>
                            )}
                          {fileState[formField.name]?.size && (
                            <div className="absolute -bottom-1.5 left-1/2 flex w-full -translate-x-1/2 transform justify-center">
                              <span className="bg-background text-muted-foreground rounded-sm border px-1 text-xs uppercase">
                                {fileState[formField.name]?.size}
                              </span>
                            </div>
                          )}
                        </div>
                      </FormLabel>
                    </>
                  )}

                  {formField.type === "select" && (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={
                        Object.keys(formField.options ?? {}).includes(
                          String(formField.default),
                        )
                          ? String(formField.default)
                          : undefined
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              formField.placeholder ?? "Select an option"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(formField.options ?? {}).map(
                          ([key, value]) => (
                            <SelectItem key={key} value={key}>
                              {value}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  )}

                  {formField.type === "textarea" && (
                    <FormControl>
                      <Textarea
                        {...formField}
                        {...field}
                        value={
                          field.value as
                            | string
                            | number
                            | readonly string[]
                            | undefined
                        }
                      />
                    </FormControl>
                  )}

                  {formField.description && (
                    <FormDescription>{formField.description}</FormDescription>
                  )}
                  <FormMessage className="absolute -bottom-5 text-xs" />
                </FormItem>
              )}
            />
          )
        })}
        <Button
          type="submit"
          className="col-span-full mt-3 w-full"
          disabled={disabled || form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </Form>
  )
}
