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
    title?: string
  }
}

const Block = (props: Props) => {
  const name = "Image Block"
  const schema = z.object({
    image: z
      .string()
      .min(1, {
        message: "Please upload an image",
      })
      .field({
        type: "file",
        label: "Image",
        default: props.meta?.image || "",
        prefix: process.env.NEXT_PUBLIC_CDN_URL + "/",
        keyprefix: `website/${props.websiteId}/blocks/${props.id}/image/`,
      }),
    title: z.string().field({
      label: "Title (optional)",
      default: props.meta?.title || "",
    }),
  })

  return (
    <BlockContent id={props.id} active={props.active}>
      <BlockEditor name={name} schema={schema} data={props} />
    </BlockContent>
  )
}

const View = (props: Props) => {
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

export const { Block: ImageBlock, View: ImageView } = { Block, View }
