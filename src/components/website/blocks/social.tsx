import { BlockContent, BlockEditor } from "@/components/website/block-manager"
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
  return (
    <>
      {props.meta?.href ? (
        <div>Temp</div>
      ) : (
        <div className="text-muted-foreground flex h-14 items-center justify-center rounded-md border border-dashed text-sm">
          Social Block
        </div>
      )}
    </>
  )
}

export const { Block: SocialBlock, View: SocialView } = { Block, View }
