import {
  DeleteObjectsCommand,
  ListObjectsV2Command,
  S3Client,
} from "@aws-sdk/client-s3"
import { S3Event } from "aws-lambda"
import { Hono } from "hono"
import { handle } from "hono/aws-lambda"

const s3Client = new S3Client({
  region: process.env.S3_REGION as string,
  endpoint: process.env.S3_ENDPOINT as string,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
  },
})

interface Env {
  event: S3Event
}

const app = new Hono<{ Bindings: Env }>()

app.get("/", async (c) => {
  console.log(JSON.stringify(c.env, null, 2))

  const events = c.env.event.Records.map((record) => {
    return {
      bucket: record.s3.bucket.name,
      key: record.s3.object.key,
    }
  })

  for (const event of events) {
    const { bucket, key } = event

    // Extract the prefix using regex
    const match = key.match(/^(.*\/)v\d+$/)
    if (!match) {
      console.error(`Key does not match expected pattern: ${key}`)
      continue
    }
    const prefix = match[1] // Extract everything before /v<number>
    console.log(`Extracted prefix: ${prefix}`)

    // List all objects in the prefix
    const listCommand = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
    })
    const listResponse = await s3Client.send(listCommand)

    if (listResponse.Contents) {
      // Find the latest version
      const sortedKeys = listResponse.Contents.sort((a, b) => {
        const versionA = parseInt(a.Key!.match(/v(\d+)$/)?.[1] || "0", 10)
        const versionB = parseInt(b.Key!.match(/v(\d+)$/)?.[1] || "0", 10)
        return versionB - versionA // Sort descending by version
      })

      const latestKey = sortedKeys[0]?.Key
      console.log(`Latest key: ${latestKey}`)

      // Delete all old versions except the latest
      const objectsToDelete = sortedKeys
        .filter((object) => object.Key !== latestKey)
        .map((object) => ({ Key: object.Key! }))

      if (objectsToDelete.length > 0) {
        console.log("Objects to delete:", objectsToDelete)

        const deleteCommand = new DeleteObjectsCommand({
          Bucket: bucket,
          Delete: {
            Objects: objectsToDelete,
          },
        })
        const deleteResponse = await s3Client.send(deleteCommand)
        console.log("Delete response:", deleteResponse)
      } else {
        console.log("No old objects to delete.")
      }
    }
  }

  return c.json({ events })
})

export const handler = handle(app)
