"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { humanTime } from "@/lib/utils"
import { useState } from "react"

export default function Dashboard({
  users,
  metrics,
}: {
  users: {
    id: string
    name: string
    email: string
    image: string
    createdAt: string
    updatedAt: string
  }[]
  metrics: { totalUsers: number; activeToday: number; joinedThisWeek: number }
}) {
  const [sortCriteria, setSortCriteria] = useState<
    "lastLogin" | "dateJoined" | "alphabetical"
  >("lastLogin")

  const sortedUsers = [...users].sort((a, b) => {
    if (sortCriteria === "lastLogin") {
      return new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime()
    }
    if (sortCriteria === "dateJoined") {
      return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    }
    if (sortCriteria === "alphabetical") {
      return a.name.localeCompare(b.name)
    }
    return 0
  })

  return (
    <div className="mx-auto w-full max-w-screen-lg space-y-5 p-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-sidebar rounded-md border p-5">
          <h2 className="font-medium">Active Today</h2>
          <p className="mt-2 text-2xl font-semibold">{metrics.activeToday}</p>
        </div>
        <div className="bg-sidebar rounded-md border p-5">
          <h2 className="font-medium">Joined This Week</h2>
          <p className="mt-2 text-2xl font-semibold">
            {metrics.joinedThisWeek}
          </p>
        </div>
        <div className="bg-sidebar rounded-md border p-5">
          <h2 className="font-medium">Total Users</h2>
          <p className="mt-2 text-2xl font-semibold">{metrics.totalUsers}</p>
        </div>
      </div>

      {/* Sort Dropdown */}
      <div className="grid grid-cols-2 items-center gap-3 lg:grid-cols-3">
        <h2 className="font-medium">Users</h2>
        <span className="hidden lg:block" />
        <Select
          onValueChange={(value) =>
            setSortCriteria(value as typeof sortCriteria)
          }
          value={sortCriteria}
        >
          <SelectTrigger className="bg-sidebar w-full">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lastLogin">Last Login</SelectItem>
            <SelectItem value="dateJoined">Date Joined</SelectItem>
            <SelectItem value="alphabetical">Alphabetically</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users List */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sortedUsers.map((user) => (
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
                {
                  {
                    lastLogin: `Last login ${humanTime(
                      new Date(user.updatedAt!).getTime(),
                    )}`,
                    dateJoined: `Joined ${humanTime(
                      new Date(user.createdAt!).getTime(),
                    )}`,
                    alphabetical: `Last login ${humanTime(
                      new Date(user.updatedAt!).getTime(),
                    )}`,
                  }[sortCriteria]
                }
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
