import { auth } from "@/lib/auth"

// Function to handle requests without authentication
export function open(
  handler: (request: Request) => Promise<Response> | Response,
): (request: Request) => Promise<Response> {
  return async (request: Request): Promise<Response> => {
    try {
      return await handler(request)
    } catch (error: unknown) {
      console.log(error)
      if (error instanceof Error) {
        return new Response(JSON.stringify({ message: error.message }), {
          status: 404,
        })
      } else {
        return new Response(JSON.stringify({ message: "404" }), { status: 404 })
      }
    }
  }
}

// Function to handle requests with authentication
export function secure(
  handler: (request: Request, userId: string) => Promise<Response> | Response,
): (request: Request) => Promise<Response> {
  return async (request: Request): Promise<Response> => {
    try {
      const { userId } = await withSession()
      return await handler(request, userId)
    } catch (error: unknown) {
      console.log(error)
      if (error instanceof Error) {
        return new Response(JSON.stringify({ message: error.message }), {
          status: 404,
        })
      } else {
        return new Response(JSON.stringify({ message: "404" }), { status: 404 })
      }
    }
  }
}

// Function to validate session and extract userId
const withSession = async (): Promise<{ userId: string }> => {
  const session = await auth()
  if (!session) {
    throw new Error("Unauthorized")
  }
  return { userId: session.user.id }
}
