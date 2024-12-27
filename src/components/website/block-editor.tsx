import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ZodHookForm } from "@/components/x/zod-hook-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Pencil } from "lucide-react"
import { useState } from "react"
import { z } from "zod"

type EditorProps = {
  schema: z.ZodObject<z.ZodRawShape>
  data: {
    websiteId: string
    id: string
    type: string
    active: boolean
  }
}

export const BlockEditor = ({ schema, data }: EditorProps) => {
  const fields = Object.entries(schema?.shape).map(([key, value]) => ({
    key,
    ...JSON.parse(value?._def.description ?? "{}"),
  }))
  const fileValues = Object.fromEntries(
    fields
      .filter((field) => field.type === "file")
      .map((field) => [field.key, field.default]),
  )
  const queryClient = useQueryClient()
  const mutuation = useMutation({
    mutationFn: async (values: z.infer<typeof schema>) => {
      const removeFiles = Object.keys(fileValues)
        .filter((key) => key in values && fileValues[key] !== values[key])
        .map((key) => fileValues[key])
      const files = Object.keys(values).filter((key) => {
        try {
          JSON.parse(values[key])
          return true
        } catch {
          return false
        }
      })
      files.forEach((key) => {
        values[key] = JSON.parse(values[key]).key
      })
      const res = await fetch("/api/v1/website", {
        method: "PATCH",
        body: JSON.stringify({
          websiteId: data.websiteId,
          block: {
            id: data.id,
            type: data.type,
            active: data.active,
            meta: values,
          },
          removeFiles,
        }),
      })
      return await res.json()
    },
    onMutate: async (values: z.infer<typeof schema>) => {
      const valuesCopy = { ...values }
      const files = Object.keys(valuesCopy).filter((key) => {
        try {
          JSON.parse(valuesCopy[key])
          return true
        } catch {
          return false
        }
      })
      files.forEach((key) => {
        valuesCopy[key] = JSON.parse(valuesCopy[key]).value
      })
      await queryClient.cancelQueries({
        queryKey: ["website"],
      })
      const prev = queryClient.getQueryData(["website"])
      queryClient.setQueryData(
        ["website"],
        (prev: {
          blocks: {
            id: string
            type: string
            active: boolean
            meta: Record<string, string>
          }[]
        }) => {
          return {
            ...prev,
            blocks: prev.blocks.map((block) => {
              if (block.id === data.id) {
                return {
                  id: data.id,
                  type: data.type,
                  active: data.active,
                  meta: valuesCopy,
                }
              }
              return block
            }),
          }
        },
      )
      setOpen(false)
      return { prev }
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(["website"], context?.prev)
    },
  })

  const onSubmit = async (values: z.infer<typeof schema>) => {
    await mutuation.mutateAsync(values)
    setOpen(false)
  }

  const [open, setOpen] = useState(false)

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/v1/website", {
        method: "DELETE",
        body: JSON.stringify({
          websiteId: data.websiteId,
          block: {
            id: data.id,
          },
        }),
      })
      return await res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["website"],
      })
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="text-foreground/65 absolute top-1/2 right-3 aspect-square size-6 -translate-y-1/2 transform p-0"
          variant="outline"
        >
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Link</DialogTitle>
        </DialogHeader>
        <ZodHookForm schema={schema} onSubmit={onSubmit} />
        <Button
          variant="destructive"
          onClick={async () => {
            await deleteMutation.mutateAsync()
            setOpen(false)
          }}
        >
          Delete
        </Button>
      </DialogContent>
    </Dialog>
  )
}
