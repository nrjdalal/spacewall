import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { db, users } from "@/db"
import { auth } from "@/lib/auth"
import { humanTime } from "@/lib/utils"

export default async function Page() {
  const session = await auth()

  const adminUsers = process.env.SW_ADMINS!.split(",")

  if (
    !session ||
    !session.user ||
    !session.user.email ||
    !adminUsers.includes(session.user.email as string)
  ) {
    return <h1 className="p-5">SW is for SpaceWall</h1>
  }

  const data = await db.select().from(users)

  data.sort((a, b) => {
    if (a.updatedAt! < b.updatedAt!) return 1
    if (a.updatedAt! > b.updatedAt!) return -1
    return 0
  })

  return (
    <div className="mx-auto w-full max-w-screen-lg space-y-5 p-5">
      <div className="@container space-y-3">
        <div className="grid grid-cols-1 gap-3 @sm:grid-cols-2 @lg:grid-cols-3">
          <div className="bg-sidebar rounded-md border p-5">
            <h2 className="font-medium">Total Users</h2>
            <p className="mt-2 text-2xl font-semibold">{data.length}</p>
            <p className="text-foreground/50 text-xs">+0% from last week</p>
          </div>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((user) => (
          <div
            key={user.id}
            className="bg-sidebar flex items-center gap-3 rounded-md border p-3"
          >
            <Avatar className="size-14 rounded-lg">
              <AvatarImage src={user.image ?? ""} alt={user.name ?? ""} />
              <AvatarFallback className="rounded-lg">SW</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user.name}</span>
              <span className="truncate text-xs">{user.email}</span>
              <p className="text-muted-foreground text-xs">
                Last seen {humanTime(user.updatedAt!)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
