import { auth } from "@/lib/auth"

export async function GET() {
  const session = await auth()

  if (!session) {
    return Response.json({
      status: 401,
      json: {
        error: "Unauthorized",
      },
    })
  }

  return Response.json({
    status: 200,
    json: {
      title: null,
      description: null,
    },
  })
}
