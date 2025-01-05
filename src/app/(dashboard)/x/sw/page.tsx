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

  const data = (await db.select().from(users))
    .map((user) => ({
      ...user,
      name: user.name || "",
      email: user.email || "",
      image: user.image || "",
      createdAt: user.createdAt ? user.createdAt.toISOString() : "",
      updatedAt: user.updatedAt ? user.updatedAt.toISOString() : "",
    }))
    .filter((user) => user.email !== session.user?.email)

  const activeTodayCount = data.filter(
    (user) =>
      new Date(user.updatedAt!).toDateString() === new Date().toDateString(),
  ).length

  const joinedThisWeekCount = data.filter((user) => {
    const createdAt = new Date(user.createdAt!)
    const now = new Date()
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
