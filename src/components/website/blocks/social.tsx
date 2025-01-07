/* eslint-disable @next/next/no-img-element */

import { Icons } from "@/assets/icons"
import { BlockContent, BlockEditor } from "@/components/website/block-manager"
import {
  SiApplemusic,
  SiBluesky,
  SiFacebook,
  SiGithub,
  SiGmail,
  SiInstagram,
  SiNpm,
  SiSpotify,
  SiTiktok,
  SiYoutube,
} from "@icons-pack/react-simple-icons"
import { LinkIcon } from "lucide-react"
import Link from "next/link"
import { createElement } from "react"
import { z } from "zod"

const Schema = z.object({
  websiteId: z.string(),
  id: z.string(),
  type: z.string(),
  active: z.boolean(),
  meta: z
    .object({
      href: z.string().optional(),
      logo: z
        .string()
        .optional()
        .describe(JSON.stringify({ storage: true })),
    })
    .optional(),
})

type Schema = z.infer<typeof Schema>

const Block = (props: Schema) => {
  const name = "Social"
  const schema = z.object({
    href: z
      .string()
      .url()
      .field({
        label: "URL",
        default: props.meta?.href || "",
      }),
    logo: z.string().field({
      type: "file",
      accept: "image/*",
      label: "Logo (optional)",
      default: props.meta?.logo || "",
      prefix: process.env.NEXT_PUBLIC_CDN_URL + "/",
      keyprefix: `website/${props.websiteId}/blocks/${props.id}/logo/`,
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
    "x.com": Icons.X,
    "youtube.com": SiYoutube,
    "linkedin.com": Icons.Linkedin,
    "music.apple.com": SiApplemusic,
    "spotify.com": SiSpotify,
    "tiktok.com": SiTiktok,
  }

  return (
    <>
      {props.meta?.href ? (
        <Link href={props.meta.href} className="my-2" target="_blank">
          {props.meta?.logo ? (
            <img
              className="h-8 w-8 rounded-full object-cover object-center"
              src={
                props.meta.logo.startsWith("data:")
                  ? props.meta.logo
                  : process.env.NEXT_PUBLIC_CDN_URL + "/" + props.meta.logo
              }
              alt={props.meta.href}
            />
          ) : (
            <>
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
                  { className: "size-6" },
                )
              ) : (
                <LinkIcon className="text-muted-foreground/50 size-6 stroke-1" />
              )}
            </>
          )}
        </Link>
      ) : (
        <div className="flex size-6 items-center justify-center rounded-md border border-dashed">
          ?
        </div>
      )}
    </>
  )
}

export const {
  Schema: SocialSchema,
  Block: SocialBlock,
  View: SocialView,
} = { Schema, Block, View }
