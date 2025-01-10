import { Button } from "@/components/ui/button"
import WebsiteView from "@/components/views/website"
import { ChevronRight, Crown } from "lucide-react"
import Link from "next/link"

export const dynamicParams = true

export async function generateStaticParams() {
  return []
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const slug = (await params).slug

  const website = await (
    await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/public/website?slug=${slug}`,
      {
        next: {
          revalidate: Infinity,
        },
      },
    )
  ).json()

  if (!website?.id) {
    return (
      <main className="flex min-h-dvh items-center justify-center p-7.5">
        <div className="max-w-sm space-y-6 text-center">
          <h1 className="flex items-center justify-center text-6xl font-medium">
            Space
            <Crown className="size-13" />
            all
          </h1>

          <p className="animate-bounce text-lg font-medium text-pretty uppercase italic">
            Claim your space
          </p>

          <div className="flex items-center justify-center gap-x-5 px-5">
            <Link href="/access" className="w-full">
              <Button className="h-10 w-full">
                <span className="mt-0.75">Log in</span>
                <ChevronRight />
              </Button>
            </Link>
            <Link href="mailto:admin@nrjdalal.com" className="w-full">
              <Button variant="outline" className="h-10 w-full">
                <span className="mt-0.75">Contact</span>
              </Button>
            </Link>
          </div>
        </div>
        <p className="text-primary/35 absolute bottom-4 text-center text-xs">
          Current version is for demonstration purposes only.
        </p>
      </main>
    )
  }

  website.blocks = website.blocks?.filter(
    (block: { active: boolean }) => block.active,
  )

  return <WebsiteView data={website} />
}
