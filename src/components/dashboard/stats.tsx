export default function Stats() {
  return (
    <div className="@container space-y-3">
      <div className="grid grid-cols-1 gap-3 @sm:grid-cols-2 @lg:grid-cols-3">
        <div className="rounded-md border p-5">
          <h2 className="font-medium">Visitors</h2>
          <p className="mt-2 text-2xl font-semibold">0</p>
          <p className="text-foreground/50 text-xs">+0% from last week</p>
        </div>
        <div className="rounded-md border p-5">
          <h2 className="font-medium">Revenue</h2>
          <p className="mt-2 text-2xl font-semibold">$0</p>
          <p className="text-foreground/50 text-xs">+0% from last week</p>
        </div>
        <div className="rounded-md border p-5">
          <h2 className="font-medium">Orders</h2>
          <p className="mt-2 text-2xl font-semibold">0</p>
          <p className="text-foreground/50 text-xs">+0% from last week</p>
        </div>
      </div>
    </div>
  )
}
