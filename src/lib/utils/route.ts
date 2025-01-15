import { auth } from "@/lib/auth"
import { type Session } from "next-auth"
import { z } from "zod"

// import { redis } from "@/db"
// import { Ratelimit } from "@upstash/ratelimit"

// const ratelimit = new Ratelimit({
//   redis: redis,
//   limiter: Ratelimit.slidingWindow(1, "5s"),
//   prefix: "ratelimit:",
// })

// const ip = request.ip ?? "127.0.0.1"
// const { remaining } = await ratelimit.limit(ip)
// if (remaining === 0) throw new Error("Rate limit exceeded")

// Declare the global augmentation for the Request interface
declare global {
  interface Request {
    searchParams(): Promise<Record<string, string>>
  }
}

// Extend the Request prototype with a 'searchParams' method
if (!Request.prototype.hasOwnProperty("searchParams")) {
  Object.defineProperty(Request.prototype, "searchParams", {
    value: async function () {
      return Object.fromEntries(new URL(this.url).searchParams.entries())
    },
  })
}

// General function to handle requests and errors
async function handleRequest(
  handler: (
    request: Request,
    userId: string,
    session: Session,
  ) => Promise<Response>,
  request: Request,
  userId: string,
  session: Session,
): Promise<Response> {
  try {
    return await handler(request, userId, session)
  } catch (error) {
    console.error(error)
    const message = handleErrors(error)
    return new Response(JSON.stringify({ message }), { status: 404 })
  }
}

// Function to validate session and extract session data
const withSession = async (): Promise<{
  session: Session
}> => {
  const session = await auth()
  if (!session) {
    throw new Error("Unauthorized")
  }
  return {
    session,
  }
}

// Function to handle errors, including zod validation errors
function handleErrors(error: unknown): string {
  if (error instanceof z.ZodError) {
    return error.issues[0].message
  } else if (error instanceof Error) {
    return error.message
  } else {
    return "Unknown error"
  }
}

// Function to handle requests without authentication
export function open(
  handler: (request: Request) => Promise<Response>,
): (request: Request) => Promise<Response> {
  return (request: Request): Promise<Response> =>
    handleRequest(handler, request, "", {} as Session)
}

// Function to handle requests with authentication and include the userId and session
export function secure(
  handler: (
    request: Request,
    userId: string,
    session: Session,
  ) => Promise<Response>,
): (request: Request) => Promise<Response> {
  return async (request: Request): Promise<Response> => {
    const { session } = await withSession()
    return handleRequest(handler, request, session.user.id, session)
  }
}
