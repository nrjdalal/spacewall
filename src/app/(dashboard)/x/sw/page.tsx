import { db, users } from "@/db"
import { auth } from "@/lib/auth"
import Dashboard from "./view.client"

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

  let data = (await db.select().from(users)).map((user) => ({
    ...user,
    name: user.name || "",
    email: user.email || "",
    image: user.image || "",
    createdAt: user.createdAt ? user.createdAt.toISOString() : "",
    updatedAt: user.updatedAt ? user.updatedAt.toISOString() : "",
  }))

  if (process.env.NODE_ENV !== "development") {
    data = data.filter((user) => user.email !== session.user?.email)
  }

  const indianTimeOffset = 5.5 * 60 * 60 * 1000 // IST is UTC+5:30

  const activeTodayCount = data.filter((user) => {
    const userUpdatedAt = new Date(
      new Date(user.updatedAt!).getTime() + indianTimeOffset,
    )
    const now = new Date(new Date().getTime() + indianTimeOffset)
    return userUpdatedAt.toDateString() === now.toDateString()
  }).length

  const joinedThisWeekCount = data.filter((user) => {
    const createdAt = new Date(
      new Date(user.createdAt!).getTime() + indianTimeOffset,
    )
    const now = new Date(new Date().getTime() + indianTimeOffset)
    const weekStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - now.getDay(),
    )
    return createdAt >= weekStart
  }).length

  return (
    <Dashboard
      users={data}
      metrics={{
        totalUsers: data.length,
        activeToday: activeTodayCount,
        joinedThisWeek: joinedThisWeekCount,
      }}
    />
  )
}
