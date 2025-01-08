import { Button } from "@/components/ui/button"
import { Crown } from "lucide-react"
import Link from "next/link"

export default function Page() {
  return (
    <main className="mx-auto min-h-dvh max-w-screen-lg p-5">
      <Navbar />

      <h1 className="mt-32 px-5 text-4xl sm:text-6xl">
        Everything you are.
        <br />
        In one, simple link in bio.
      </h1>

      <p className="text-muted-foreground mt-5 px-5 text-lg">
        Join 1000+ people using SpaceWall for their link in bio. One link to
        help you share everything you create, curate and sell from your
        Instagram, TikTok, Twitter, YouTube and other social media profiles.
      </p>

      <div className="bg-sidebar mt-16 rounded-2xl border px-5 py-16">
        <h1 className="text-4xl sm:text-6xl">
          Create and customize your SpaceWall in minutes
        </h1>

        <p className="text-muted-foreground mt-5 text-lg">
          Connect your TikTok, Instagram, Twitter, website, store, videos,
          music, podcast, events and more. It all comes together in a link in
          bio landing page designed to convert.
        </p>

        <Link href="/access">
          <Button className="mt-10 text-base font-medium" size="lg">
            Get started
          </Button>
        </Link>
      </div>

      {/* <div className="max-w-sm space-y-6 text-center">
        <h1 className="flex items-center justify-center text-6xl font-medium">
          Space
          <Crown className="size-13" />
          all
        </h1>

        <p className="text-lg font-medium text-pretty">
          Transforming the creators of tomorrow.
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
      </div> */}
      {/* <p className="text-primary/35 absolute bottom-4 text-center text-xs">
        Current version is for demonstration purposes only.
      </p> */}
    </main>
  )
}

const Navbar = () => {
  return (
    <div className="fixed top-5 left-1/2 mx-auto h-16 w-full max-w-screen-lg -translate-x-1/2 transform px-5">
      <nav className="bg-sidebar flex h-full w-full items-center justify-between rounded-2xl border px-5">
        <Link
          href="/"
          className="flex h-full items-center justify-center text-3xl select-none"
        >
          Space
          <Crown className="mb-px size-7" />
          all
        </Link>

        <Link href="/access">
          <Button className="text-base font-medium" size="lg">
            Log in
          </Button>
        </Link>
      </nav>
    </div>
  )
}
