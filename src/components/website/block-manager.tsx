"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ZodHookForm } from "@/components/x/zod-hook-form"
import { cn } from "@/lib/utils"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { GripHorizontal, GripVertical, Pencil } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
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

export const BlockContent = ({
  id,
  className,
  children,
  ...props
}: {
  id: string
  className: string
  children: React.ReactNode
  [key: string]: unknown
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      className={cn("relative touch-none", className)}
      style={style}
      {...props}
    >
      <div
        {...listeners}
        {...attributes}
        className="text-muted-foreground absolute -top-3 left-1/2 z-5 flex min-h-8 min-w-12 -translate-x-1/2 transform cursor-grab justify-center sm:top-1/2 sm:bottom-auto sm:-left-3 sm:min-h-12 sm:min-w-8 sm:-translate-y-1/2 sm:translate-x-0 sm:flex-col"
      >
        <GripHorizontal className="sm:hidden" />
        <GripVertical className="hidden sm:block" />
      </div>
      {children}
    </div>
  )
}

export const BlockEditor = ({ schema, data }: EditorProps) => {
  const queryClient = useQueryClient()

  const mutuation = useMutation({
    mutationFn: async (values: z.infer<typeof schema>) => {
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
        valuesCopy[key] = JSON.parse(valuesCopy[key]).key + "?t=" + Date.now()
      })
      const res = await fetch("/api/v1/website", {
        method: "PATCH",
        body: JSON.stringify({
          websiteId: data.websiteId,
          block: {
            id: data.id,
            type: data.type,
            active: data.active,
            meta: valuesCopy,
          },
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
        <ZodHookForm
          schema={schema}
          onSubmit={onSubmit}
          invalidate={["website"]}
          message={{
            loading: "Updating block. Don't close the tab!",
            success: "Block updated.",
            error: "Updation failed!",
          }}
        />
        <Button
          variant="destructive"
          onClick={async () => {
            setOpen(false)
            toast.promise(deleteMutation.mutateAsync(), {
              loading: "Deleting block. Don't close the tab!",
              success: "Block deleted.",
              error: "Deletion failed!",
            })
          }}
        >
          Delete
        </Button>
      </DialogContent>
    </Dialog>
  )
}
