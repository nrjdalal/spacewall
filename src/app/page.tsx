import { Button } from "@/components/ui/button"
import { ChevronRight, Crown } from "lucide-react"
import Link from "next/link"

export default function Page() {
  return (
    <main className="flex min-h-dvh items-center justify-center p-7.5">
      <div className="max-w-sm space-y-6 text-center">
        <h1 className="flex items-center justify-center text-6xl font-medium">
          Space
          <Crown className="size-12" />
          all
        </h1>

        <p className="text-lg font-medium text-pretty">
          Transforming the creators of tomorrow.
        </p>

        <div className="flex items-center justify-center gap-x-5 px-5">
          <Link href="/access" className="w-full">
            <Button className="w-full">
              <span className="mt-0.5 ml-1">Log in</span>
              <ChevronRight />
            </Button>
          </Link>
          <Link href="mailto:admin@nrjdalal.com" className="w-full">
            <Button variant="outline" className="w-full">
              <span className="mt-0.5">Contact</span>
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
