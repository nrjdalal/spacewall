import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Example() {
  return (
    <main className="grid min-h-dvh place-items-center px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold">Launching soon.</p>
        <h1 className="mt-4 text-5xl font-semibold text-balance sm:text-7xl">
          SpaceWall
        </h1>
        <p className="mt-6 text-lg font-medium text-pretty sm:text-xl/8">
          For now you can log in to test the app.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-5 px-5">
          <Button asChild>
            <Link href="/access" className="w-full">
              Log in <span aria-hidden="true">&rarr;</span>
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="mailto:admin@nrjdalal.com" className="w-full">
              Contact
            </Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
