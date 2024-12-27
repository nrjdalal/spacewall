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

type BlockEditorProps = {
  schema: z.ZodObject<z.ZodRawShape>
  data: {
    websiteId: string
    id: string
    type: string
    active: boolean
  }
}

export const BlockEditor = ({ schema, data }: BlockEditorProps) => {
  const queryClient = useQueryClient()

  const mutuation = useMutation({
    mutationFn: async (values: z.infer<typeof schema>) => {
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
