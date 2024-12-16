import XContent from "@/components/common/x-content"
import XHeader from "@/components/common/x-header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default async function Page() {
  return (
    <>
      <XHeader
        title="Website"
        description="Think link in bio, one link, etc but for professionals."
      />
      <XContent className="lg:grid lg:grid-cols-5 lg:gap-5">
        <div className="max-w-xl lg:col-span-3">
          <div className="flex items-center space-x-3">
            <div className="size-24 rounded-full border"></div>
            <div>
              <h1 className="font-medium">Display Name</h1>
              <p className="text-foreground/60 text-sm">
                Your amazing bio (optional)
              </p>
            </div>
          </div>

          <Button className="mt-8 w-full rounded-full lg:h-12">
            <Plus /> Add widget
          </Button>

          <div>
            <div className="mt-8 flex items-center space-x-3 rounded-lg border p-3">
              <div className="aspect-square size-18 rounded-lg border"></div>
              <div>
                <h1 className="font-medium">#baliVlog</h1>
                <p className="text-foreground/60 text-xs lg:text-sm">
                  A trip to Bali with my friends. It was amazing!
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="text-foreground/60 hidden aspect-[9/16] max-w-sm items-center justify-center rounded-lg border lg:col-span-2 lg:flex">
          Preview
        </div>
      </XContent>
    </>
  )
}
