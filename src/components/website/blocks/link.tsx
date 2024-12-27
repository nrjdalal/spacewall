/* eslint-disable @next/next/no-img-element */

import { Camera } from "lucide-react"
import { z } from "zod"
import { BlockEditor } from "../block-editor"

interface BlockLinkProps {
  websiteId: string
  id: string
  type: string
  active: boolean
  meta?: {
    title?: string
    href?: string
    image?: string
    description?: string
  }
}

export const BlockLink = (props: BlockLinkProps) => {
  const schema = z.object({
    title: z
      .string()
      .min(1)
      .max(128)
      .field({
        label: "Title",
        default: props.meta?.title || "",
      }),
    href: z
      .string()
      .url()
      .field({
        label: "URL",
        default: props.meta?.href || "",
      }),
    description: z
      .string()
      .max(256)
      .field({
        type: "textarea",
        label: "Description",
        default: props.meta?.description || "",
      }),
    image: z.string().field({
      type: "file",
      label: "Image",
      default: props.meta?.image || "",
      prefix: process.env.NEXT_PUBLIC_CDN_URL + "/",
      keyprefix: "website/link/image/",
    }),
  })

  return (
    <div
      key={props.id}
      className="relative grid grid-cols-6 items-center gap-1.5 rounded-md border p-1"
    >
      <BlockEditor schema={schema} data={props} />
      <div className="col-span-1">
        {props.meta?.image ? (
          <div className="bg-secondary aspect-square h-full max-h-14 overflow-hidden rounded-md border">
            <img
              className="aspect-square h-full object-cover object-center"
              src={process.env.NEXT_PUBLIC_CDN_URL + "/" + props.meta.image}
              alt={props.meta.title}
            />
          </div>
        ) : (
          <div className="text-muted-foreground/25 grid aspect-square h-full max-h-14 place-content-center">
            <Camera className="size-6 stroke-1" />
          </div>
        )}
      </div>
      <div className="col-span-4 w-full text-center">
        <h1 className="line-clamp-2 text-sm font-medium break-words">
          {props.meta?.title || "Link Block"}
        </h1>
        {props.meta?.description && (
          <p className="text-muted-foreground text-xs">
            {props.meta.description}
          </p>
        )}
      </div>
    </div>
  )
}

// const DialogEditBlockLink = (data: BlockLinkProps) => {
//   const schema = z.object({
//     title: z
//       .string()
//       .min(1)
//       .max(128)
//       .field({
//         label: "Title",
//         default: data.meta?.title || "",
//       }),
//     url: z
//       .string()
//       .url()
//       .field({
//         label: "URL",
//         default: data.meta?.href || "",
//       }),
//     description: z
//       .string()
//       .max(256)
//       .field({
//         type: "textarea",
//         label: "Description",
//         default: data.meta?.description || "",
//       }),
//     image: z.string().field({
//       type: "file",
//       label: "Image",
//       default: data.meta?.image || "",
//       prefix: process.env.NEXT_PUBLIC_CDN_URL + "/",
//       keyprefix: "website/link/image/",
//     }),
//   })

//   const queryClient = useQueryClient()

//   const mutuation = useMutation({
//     mutationFn: async (values: z.infer<typeof schema>) => {
//       const res = await fetch("/api/v1/website", {
//         method: "PATCH",
//         body: JSON.stringify({
//           websiteId: data.websiteId,
//           block: {
//             id: data.id,
//             meta: values,
//           },
//         }),
//       })
//       return await res.json()
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: ["website"],
//       })
//     },
//   })

//   const onSubmit = async (values: z.infer<typeof schema>) => {
//     await mutuation.mutateAsync(values)
//     setOpen(false)
//   }

//   const [open, setOpen] = useState(false)

//   const deleteMutation = useMutation({
//     mutationFn: async () => {
//       const res = await fetch("/api/v1/website", {
//         method: "DELETE",
//         body: JSON.stringify({
//           websiteId: data.websiteId,
//           block: {
//             id: data.id,
//           },
//         }),
//       })
//       return await res.json()
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: ["website"],
//       })
//     },
//   })

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button
//           className="text-foreground/65 absolute top-1/2 right-3 aspect-square size-6 -translate-y-1/2 transform p-0"
//           variant="outline"
//         >
//           <Pencil />
//         </Button>
//       </DialogTrigger>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Manage Link</DialogTitle>
//         </DialogHeader>
//         {/* @ts-expect-error will fix later */}
//         <ZodHookForm schema={schema} onSubmit={onSubmit} />
//         <Button
//           variant="destructive"
//           onClick={async () => {
//             await deleteMutation.mutateAsync()
//             setOpen(false)
//           }}
//         >
//           Delete
//         </Button>
//       </DialogContent>
//     </Dialog>
//   )
// }
