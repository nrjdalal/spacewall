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
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formFieldSchema = z
  .object({
    type: z
      .enum(["email", "file", "password", "select", "text", "textarea"])
      .default("text"),
    default: z.unknown().optional(),
    label: z.string().optional(),
    description: z.string().optional(),
    options: z.record(z.string()).optional(),
    span: z.enum(["1/2", "1/3", "2/3", "1/4", "2/4", "3/4"]).optional(),
    placeholder: z.string().optional(),
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
  interface ZodString {
    field(describe: Partial<z.infer<typeof formFieldSchema>>): this
  }
  interface ZodUnknown {
    field(describe: Partial<z.infer<typeof formFieldSchema>>): this
  }
}

z.ZodString.prototype.field = function (describe) {
  return this.describe(describeField(describe))
}
z.ZodUnknown.prototype.field = function (describe) {
  return this.describe(describeField(describe))
}

export const ZodHookForm = ({
  className,
  schema,
  onSubmit,
  disabled,
}: {
  className?: string
  schema: z.ZodObject<z.ZodRawShape>
  onSubmit?: (values: z.infer<typeof schema>) => Promise<void>
  disabled?: boolean
}) => {
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

  const submit = async (values: z.infer<typeof schema>) => {
    if (onSubmit) {
      await onSubmit(values)
    } else {
      console.log(values)
    }
    form.reset()
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submit)}
        className={cn("grid grid-cols-12 space-y-5", className)}
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
                    <FormLabel>{formField.label}</FormLabel>
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
                    <FormControl>
                      <Input
                        {...formField}
                        {...form.register(formField.name)}
                      />
                    </FormControl>
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
          className="col-span-full mt-3 h-10 w-full"
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
