import { putObject } from "@/lib/s3"

export async function PUT(request: Request) {
  const { Key, ContentType, ContentLength, ChecksumSHA256 } =
    await request.json()

  const getSignedUrl = await putObject({
    Key,
    ContentType,
    ContentLength,
    ChecksumSHA256,
  })

  return Response.json({
    url: getSignedUrl.url,
    key: getSignedUrl.key,
  })
}
