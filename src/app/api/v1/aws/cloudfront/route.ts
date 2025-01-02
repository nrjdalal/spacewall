import {
  CloudFrontClient,
  CreateInvalidationCommand,
} from "@aws-sdk/client-cloudfront"

export async function POST(request: Request) {
  const { paths } = await request.json()

  const prefixPaths = paths.map((path: string) => {
    if (!path.startsWith("/")) {
      return `/${path}`
    }

    return path
  })

  const cloudFrontClient = new CloudFrontClient({
    region: process.env.S3_REGION as string,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
    },
  })

  const invalidationCommand = new CreateInvalidationCommand({
    DistributionId: "EWGMXDKBEPOPA",
    InvalidationBatch: {
      CallerReference: `invalidate-${Date.now()}`,
      Paths: {
        Quantity: prefixPaths.length,
        Items: prefixPaths,
      },
    },
  })

  const invalidationResponse = await cloudFrontClient.send(invalidationCommand)

  console.log(invalidationResponse)

  return Response.json(invalidationResponse)
}
