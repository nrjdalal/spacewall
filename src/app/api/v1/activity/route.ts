import { db, users } from "@/db"
import { auth } from "@/lib/auth"
import { eq } from "drizzle-orm"

export async function GET() {
  const session = await auth()

  if (!session) {
    return Response.json({
      status: 401,
      message: "Unauthorized",
    })
  }

  await db
    .update(users)
    .set({ updatedAt: new Date() })
    .where(eq(users.id, session.user?.id as string))

  return Response.json({
    status: 200,
    data: session.user,
  })
}
