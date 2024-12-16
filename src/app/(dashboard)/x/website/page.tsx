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
      <XContent className="grid max-w-screen-lg lg:grid-cols-5">
        <div className="col-span-3">
          <div className="flex items-center space-x-3">
            <div className="size-24 rounded-full border"></div>
            <div>
              <h1 className="font-medium">Name</h1>
              <p className="text-foreground/60 text-sm">Add your amazing bio</p>
            </div>
          </div>

          <Button className="mt-8 h-12 w-full rounded-full">
            <Plus /> Add links and more
          </Button>

          <div>
            <div className="mt-8 flex items-center space-x-3 rounded-lg border p-3">
              <div className="size-18 rounded-lg border"></div>
              <div>
                <h1 className="font-medium">#baliVlog</h1>
                <p className="text-foreground/60 text-sm">
                  A trip to Bali with my friends. It was amazing!
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-2"></div>
      </XContent>
    </>
  )
}
