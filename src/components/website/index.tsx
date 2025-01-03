import { Camera, FileQuestion, LinkIcon } from "lucide-react"
import { ImageBlock, ImageView } from "./blocks/image"
import { LinkBlock, LinkView } from "./blocks/link"
import { SocialBlock, SocialView } from "./blocks/social"

export const availableBlocks = [
  {
    type: "link",
    title: "Link",
    icon: LinkIcon,
    component: LinkBlock,
    view: LinkView,
  },
  {
    type: "image",
    title: "Image",
    icon: Camera,
    component: ImageBlock,
    view: ImageView,
  },
  {
    type: "social",
    title: "Social",
    icon: FileQuestion,
    component: SocialBlock,
    view: SocialView,
  },
] as const
