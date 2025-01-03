/* eslint-disable @next/next/no-img-element */

import { BlockContent, BlockEditor } from "@/components/website/block-manager"
import { z } from "zod"

interface Props {
  websiteId: string
  id: string
  type: string
  active: boolean
  meta?: {
    image?: string
  }
}

interface ViewProps {
  id: string
  meta?: {
    image?: string
  }
}

export const BlockImage = (props: Props) => {
  const schema = z.object({
    image: z
      .string()
      .min(1, {
        message: "Image is required",
      })
      .field({
        type: "file",
        label: "Image",
        default: props.meta?.image || "",
        prefix: process.env.NEXT_PUBLIC_CDN_URL + "/",
        keyprefix: `website/${props.websiteId}/blocks/${props.id}/image/`,
      }),
  })

  return (
    <BlockContent id={props.id}>
      <BlockEditor name="Image Block" schema={schema} data={props} />
    </BlockContent>
  )
}

export const ViewImage = (props: ViewProps) => {
  return (
    <div key={props.id}>
      {props.meta?.image ? (
        <img
          className="w-full rounded-md"
          src={
            props.meta?.image.startsWith("data:")
              ? props.meta?.image
              : process.env.NEXT_PUBLIC_CDN_URL + "/" + props.meta?.image
          }
          alt="Image"
        />
      ) : (
        <div className="bg-muted text-muted-foreground flex h-full min-h-14 w-full items-center justify-center rounded-md border text-sm">
          Image Block
        </div>
      )}
    </div>
  )
}
