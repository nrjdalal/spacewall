/* eslint-disable @next/next/no-img-element */

import { Icons } from "@/assets/icons"
import { BlockContent, BlockEditor } from "@/components/website/block-manager"
import { cn } from "@/lib/utils"
import {
  SiBluesky,
  SiFacebook,
  SiGithub,
  SiGmail,
  SiInstagram,
  SiNpm,
  SiX,
  SiYoutube,
} from "@icons-pack/react-simple-icons"
import { LinkIcon } from "lucide-react"
import Link from "next/link"
import { createElement } from "react"
import { z } from "zod"

type Schema = z.infer<typeof Schema>

const Schema = z.object({
  websiteId: z.string(),
  id: z.string(),
  type: z.string(),
  active: z.boolean(),
  meta: z
    .object({
      title: z.string().optional(),
      href: z.string().optional(),
      image: z
        .string()
        .optional()
        .describe(JSON.stringify({ storage: true })),
      description: z.string().optional(),
    })
    .optional(),
})

export const Block = (props: Schema) => {
  const name = "Link Block"
  const schema = z.object({
    href: z
      .string()
      .min(4, {
        message: "Please enter a valid URL",
      })
      .field({
        label: "URL",
        default: props.meta?.href || "",
      }),
    title: z.string().field({
      label: "Title (optional)",
      default: props.meta?.title || "",
    }),
    image: z.string().field({
      type: "file",
      accept: "image/*",
      label: "Image (optional)",
      default: props.meta?.image || "",
      prefix: process.env.NEXT_PUBLIC_CDN_URL + "/",
      keyprefix: `website/${props.websiteId}/blocks/${props.id}/link/`,
    }),
    description: z
      .string()
      .max(256)
      .field({
        type: "textarea",
        label: "Description (optional)",
        default: props.meta?.description || "",
      }),
  })

  return (
    <BlockContent id={props.id} active={props.active}>
      <BlockEditor name={name} schema={schema} data={props} />
    </BlockContent>
  )
}

const View = (props: Schema) => {
  const Logos = {
    "bsky.app": SiBluesky,
    "facebook.com": SiFacebook,
    "github.com": SiGithub,
    "gmail.com": SiGmail,
    "instagram.com": SiInstagram,
    "npmjs.com": SiNpm,
    "x.com": SiX,
    "youtube.com": SiYoutube,
    "linkedin.com": Icons.Linkedin,
  }

  return (
    <>
      {props.meta?.href ? (
        <Link
          href={props.meta?.href || "/x/website"}
          target={props.meta?.href ? "_blank" : "_self"}
          className={cn(
            "bg-sidebar relative grid grid-cols-6 items-center gap-1.5 rounded-md border p-1",
            !props.active && "border-dashed",
          )}
        >
          <div className="col-span-1">
            {props.meta?.image ? (
              <div className="bg-secondary aspect-square h-full max-h-14 overflow-hidden rounded-md border">
                <img
                  className="aspect-square w-full object-cover object-center"
                  src={
                    props.meta?.image.startsWith("data:")
                      ? props.meta?.image
                      : process.env.NEXT_PUBLIC_CDN_URL +
                        "/" +
                        props.meta?.image
                  }
                  alt={props.meta?.title}
                />
              </div>
            ) : (
              <div className="grid aspect-square h-full max-h-14 place-content-center">
                {Object.keys(Logos).some((key) =>
                  new URL(
                    props.meta?.href || "https://spacewall.me",
                  ).hostname.includes(key),
                ) ? (
                  createElement(
                    Logos[
                      Object.keys(Logos).find(
                        (key) => props.meta?.href?.includes(key) ?? false,
                      ) as keyof typeof Logos
                    ],
                    { className: "size-8" },
                  )
                ) : (
                  <LinkIcon className="text-muted-foreground/50 size-6 stroke-1" />
                )}
              </div>
            )}
          </div>
          <div className="col-span-4 w-full text-center">
            <h1 className="line-clamp-2 text-sm font-medium break-words">
              {props.meta?.title || "Link Block"}
            </h1>
            {props.meta?.description && (
              <p className="text-muted-foreground text-xs">
                {props.meta?.description}
              </p>
            )}
          </div>
        </Link>
      ) : (
        <div className="text-muted-foreground flex h-14 items-center justify-center rounded-md border border-dashed text-sm">
          Link Block
        </div>
      )}
    </>
  )
}

export const {
  Schema: LinkSchema,
  Block: LinkBlock,
  View: LinkView,
} = { Schema, Block, View }
