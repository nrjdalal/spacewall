import { DollarSign, Sparkle } from "lucide-react"
import Link from "next/link"

export default function Stats() {
  return (
    <div className="@container space-y-3">
      <div className="grid grid-cols-1 gap-3 @sm:grid-cols-2 @lg:grid-cols-3">
        <Link
          href="/x/website"
          className="bg-sidebar space-y-5 rounded-md border p-5"
        >
          <Sparkle />
          <h2 className="font-medium">Websites</h2>
        </Link>
        <Link
          href="/x/payment-page"
          className="bg-sidebar space-y-5 rounded-md border p-5"
        >
          <DollarSign />
          <h2 className="font-medium">Payment Pages</h2>
        </Link>
      </div>
    </div>
  )
}
