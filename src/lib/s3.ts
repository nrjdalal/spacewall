import { generateId } from "@/lib/utils"
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const s3 = new S3Client({
  region: process.env.S3_REGION as string,
  endpoint: process.env.S3_ENDPOINT as string,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
  },
})

export const putObject = async ({
  Key,
  ContentType,
  ContentLength,
  ChecksumSHA256,
}: {
  Key?: string
  ContentType: string
  ContentLength: number
  ChecksumSHA256: string
}) => {
  Key =
    Key ||
    generateId({
      length: 16,
    })

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

export const deleteObject = async (Key: string) => {
  if (!Key) {
    return console.error("Key is required!")
  }

  try {
    await s3.send(
      new DeleteObjectCommand({
        Key,
        Bucket: process.env.S3_BUCKET_NAME,
      }),
    )
    return {
      success: true,
      message: `Object with key "${Key}" deleted successfully.`,
    }
  } catch (error) {
    console.error("Error deleting object:", error)
  }
}
