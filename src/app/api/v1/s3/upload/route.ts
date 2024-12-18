import { putObject } from "@/lib/s3"

export async function PUT(request: Request) {
  const { ContentType, ContentLength, ChecksumSHA256 } = await request.json()

  console.log("ContentType", ChecksumSHA256)

  const getSignedUrl = await putObject({
    ContentType,
    ContentLength,
    ChecksumSHA256,
  })

  return Response.json({
    url: getSignedUrl.url,
    key: getSignedUrl.key,
  })
}
