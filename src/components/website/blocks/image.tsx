/* eslint-disable @next/next/no-img-element */

import { BlockContent, BlockEditor } from "@/components/website/block-manager"
import { cn } from "@/lib/utils"
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
    <BlockContent id={props.id} active={props.active}>
      <BlockEditor name="Image Block" schema={schema} data={props} />
    </BlockContent>
  )
}

export const ViewImage = (props: Props) => {
  return (
    <>
      {props.meta?.image ? (
        <img
          className={cn(
            "w-full rounded-md border",
            !props.active && "border-dashed",
          )}
          src={
            props.meta?.image.startsWith("data:")
              ? props.meta?.image
              : process.env.NEXT_PUBLIC_CDN_URL + "/" + props.meta?.image
          }
          alt="Image"
        />
      ) : (
        <div className="text-muted-foreground flex h-14 items-center justify-center rounded-md border border-dashed text-sm">
          Image Block
        </div>
      )}
    </>
  )
}
