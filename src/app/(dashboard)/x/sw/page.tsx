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

  return (
    <div className="xl:gird-cols-4 grid gap-5 p-5 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((user) => (
        <div
          key={user.id}
          className="flex items-center gap-2 rounded-md border p-3"
        >
          <Avatar className="size-14 rounded-lg">
            <AvatarImage src={user.image ?? ""} alt={user.name ?? ""} />
            <AvatarFallback className="rounded-lg">SW</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{user.name}</span>
            <span className="truncate text-xs">{user.email}</span>
            <p className="text-muted-foreground text-xs">
              Joined {humanTime(user.createdAt!)}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
