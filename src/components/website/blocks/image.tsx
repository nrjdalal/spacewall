/* eslint-disable @next/next/no-img-element */

import { BlockContent, BlockEditor } from "@/components/website/block-manager"
import { cn } from "@/lib/utils"
import { z } from "zod"

const Schema = z.object({
  websiteId: z.string(),
  id: z.string(),
  type: z.string(),
  active: z.boolean(),
  meta: z
    .object({
      image: z
        .string()
        .optional()
        .describe(JSON.stringify({ storage: true })),
      title: z.string().optional(),
    })
    .optional(),
})

type Schema = z.infer<typeof Schema>

const Block = (props: Schema) => {
  const name = "Image Block"
  const schema = z.object({
    image: z
      .string()
      .min(1, {
        message: "Please upload an image",
      })
      .field({
        type: "file",
        accept: "image/*",
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

const View = (props: Schema) => {
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

export const {
  Schema: ImageSchema,
  Block: ImageBlock,
  View: ImageView,
} = { Schema, Block, View }
