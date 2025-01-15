import { db, users } from "@/db"
import { secure } from "@/lib/route-utils" // Import the new handlers
import { eq } from "drizzle-orm"

export const GET = secure(async (request, userId) => {
  await db
    .update(users)
    .set({ updatedAt: new Date() })
    .where(eq(users.id, userId))

  return new Response(
    JSON.stringify({
      status: 200,
      message: "OK",
    }),
  )
})
