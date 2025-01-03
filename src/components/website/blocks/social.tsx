/* eslint-disable @next/next/no-img-element */

import { Icons } from "@/assets/icons"
import { BlockContent, BlockEditor } from "@/components/website/block-manager"
import {
  SiBluesky,
  SiFacebook,
  SiGmail,
  SiInstagram,
  SiNpm,
  SiYoutube,
} from "@icons-pack/react-simple-icons"
import { LinkIcon } from "lucide-react"
import Link from "next/link"
import { createElement } from "react"
import { z } from "zod"

interface Props {
  websiteId: string
  id: string
  type: string
  active: boolean
  meta?: {
    href?: string
    logo?: string
  }
}

const Block = (props: Props) => {
  const name = "Social Block"
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

const View = (props: Props) => {
  const Logos = {
    "bsky.app": SiBluesky,
    "facebook.com": SiFacebook,
    "github.com": Icons.Github,
    "gmail.com": SiGmail,
    "instagram.com": SiInstagram,
    "npmjs.com": SiNpm,
    "x.com": Icons.X,
    "youtube.com": SiYoutube,
    "linkedin.com": Icons.Linkedin,
  }

  return (
    <>
      {props.meta?.href ? (
        <Link href={props.meta.href} target="_blank">
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

export const { Block: SocialBlock, View: SocialView } = { Block, View }
