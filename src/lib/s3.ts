import { generateId } from "@/lib/utils"
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.S3_ENDPOINT as string,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
  },
})

export const putObject = async ({
  ContentType,
  ContentLength,
  ChecksumSHA256,
}: {
  ContentType: string
  ContentLength: number
  ChecksumSHA256: string
}) => {
  const Key = generateId()

  const signedUrl = await getSignedUrl(
    s3,
    new PutObjectCommand({
      Key,
      Bucket: process.env.S3_BUCKET_NAME,
      ContentType,
      ContentLength,
      ChecksumSHA256,
    }),
    { expiresIn: 3600 },
  )

  return {
    key: Key,
    url: signedUrl,
  }
}
