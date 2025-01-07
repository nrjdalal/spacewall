import { Camera, Link, Origami } from "lucide-react"
import dynamic from "next/dynamic"
import { ImageSchema } from "./blocks/image"
import { LinkSchema } from "./blocks/link"
import { SocialSchema } from "./blocks/social"

export const availableBlocks = [
  {
    type: "link",
    title: "Link",
    icon: Link,
    schema: LinkSchema,
    component: dynamic(() =>
      import("./blocks/link").then((mod) => mod.LinkBlock),
    ),
    view: dynamic(() => import("./blocks/link").then((mod) => mod.LinkView)),
  },
  {
    type: "image",
    title: "Image",
    icon: Camera,
    schema: ImageSchema,
    component: dynamic(() =>
      import("./blocks/image").then((mod) => mod.ImageBlock),
    ),
    view: dynamic(() => import("./blocks/image").then((mod) => mod.ImageView)),
  },
  {
    type: "social",
    title: "Social",
    icon: Origami,
    schema: SocialSchema,
    component: dynamic(() =>
      import("./blocks/social").then((mod) => mod.SocialBlock),
    ),
    view: dynamic(() =>
      import("./blocks/social").then((mod) => mod.SocialView),
    ),
  },
] as const
