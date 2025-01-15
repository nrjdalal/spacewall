import { db, users } from "@/db"
import { secure } from "@/lib/utils/route"
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
