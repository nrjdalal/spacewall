import { auth } from "@/lib/auth"

export async function POST(request: Request) {
  const session = await auth()

  if (!session) {
    return Response.json({
      status: 401,
      message: "Unauthorized",
    })
  }

  const data = await request.json()

  await fetch("https://ntfy.sh/spacewall-support", {
    method: "POST",
    headers: {
      Title: data.subject,
      Priority: "low",
      Click: data?.url ? data.url : "https://spacewall.com",
      Actions: data?.screenshot
        ? `view, Attachment, ${process.env.NEXT_PUBLIC_CDN_URL + "/" + JSON.parse(data.screenshot).key}`
        : `view, Website, ${data?.url ? data.url : "https://spacewall.com"}`,
    },
    body: data.message + "\n\n" + data.url,
  })

  return Response.json({
    status: 200,
  })
}
