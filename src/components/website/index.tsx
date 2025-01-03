import { Camera, LinkIcon } from "lucide-react"

export const availableBlocks = [
  {
    type: "link",
    title: "Link",
    icon: LinkIcon,
  },
  {
    type: "image",
    title: "Image",
    icon: Camera,
  },
] as const
