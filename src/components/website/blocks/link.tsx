/* eslint-disable @next/next/no-img-element */

import { Camera } from "lucide-react"
import { z } from "zod"
import { BlockEditor } from "../block-editor"

interface LinkProps {
  websiteId: string
  id: string
  type: string
  active: boolean
  meta?: {
    title?: string
    href?: string
    image?: string
    description?: string
  }
}

export const BlockLink = (props: LinkProps) => {
  const schema = z.object({
    title: z
      .string()
      .min(1)
      .max(128)
      .field({
        label: "Title",
        default: props.meta?.title || "",
      }),
    href: z
      .string()
      .url()
      .field({
        label: "URL",
        default: props.meta?.href || "",
      }),
    image: z.string().field({
      type: "file",
      label: "Image",
      default: props.meta?.image || "",
      prefix: process.env.NEXT_PUBLIC_CDN_URL + "/",
      keyprefix: "website/link/image/",
    }),
    description: z
      .string()
      .max(256)
      .field({
        type: "textarea",
        label: "Description",
        default: props.meta?.description || "",
      }),
  })

  return (
    <div
      key={props.id}
      className="relative grid grid-cols-6 items-center gap-1.5 rounded-md border p-1"
    >
      <BlockEditor schema={schema} data={props} />
      <div className="col-span-1">
        {props.meta?.image ? (
          <div className="bg-secondary aspect-square h-full max-h-14 overflow-hidden rounded-md border">
            <img
              className="aspect-square h-full object-cover object-center"
              src={process.env.NEXT_PUBLIC_CDN_URL + "/" + props.meta.image}
              alt={props.meta.title}
            />
          </div>
        ) : (
          <div className="text-muted-foreground/25 grid aspect-square h-full max-h-14 place-content-center">
            <Camera className="size-6 stroke-1" />
          </div>
        )}
      </div>
      <div className="col-span-4 w-full text-center">
        <h1 className="line-clamp-2 text-sm font-medium break-words">
          {props.meta?.title || "Link Block"}
        </h1>
        {props.meta?.description && (
          <p className="text-muted-foreground text-xs">
            {props.meta.description}
          </p>
        )}
      </div>
    </div>
  )
}
