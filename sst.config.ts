/* eslint-disable @typescript-eslint/triple-slash-reference */

/// <reference path="./.sst/platform/config.d.ts" />

import z from "zod"

export default $config({
  app(input) {
    return {
      name: "spacewall",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    }
  },
  async run() {
    const schema = z
      .object({
        PULUMI_NODEJS_STACK: z.enum(["dev", "prod"]),
        S3_REGION: z.string(),
        S3_ACCESS_KEY_ID: z.string(),
        S3_SECRET_ACCESS_KEY: z.string(),
      })
      .parse(process.env)

    const fileBucket = new sst.aws.Bucket(
      `spacewall-${schema.PULUMI_NODEJS_STACK}`,
      {
        access: "cloudfront",
        cors: {
          allowHeaders: ["*"],
          allowMethods: ["DELETE", "GET", "PUT"],
          allowOrigins: ["*"],
          exposeHeaders: [],
          maxAge: "0 seconds",
        },
      },
    )

    const fileBucketFunction = new sst.aws.Function("MyFunction", {
      handler: "aws/file-bucket.handler",
      memory: "256 MB",
      environment: {
        S3_REGION: schema.S3_REGION,
        S3_ACCESS_KEY_ID: schema.S3_ACCESS_KEY_ID,
        S3_SECRET_ACCESS_KEY: schema.S3_SECRET_ACCESS_KEY,
      },
    })

    fileBucket.notify({
      notifications: [
        {
          name: "MySubscriber",
          function: fileBucketFunction.arn,
          events: ["s3:ObjectCreated:*"],
        },
      ],
    })

    const cloudfront = new sst.aws.Router("MyRouter", {
      routes: {
        "/*": {
          bucket: fileBucket,
        },
      },
    })

    return {
      fileBucketArn: fileBucket.arn,
      fileBucketName: fileBucket.name,
      fileBucketFunctionArn: fileBucketFunction.arn,
      cloudfrontUrl: cloudfront.url,
    }
  },
})

// const vpc = new sst.aws.Vpc("MyVpc")
// const database = new sst.aws.Postgres(
//   `spacewall${schema.PULUMI_NODEJS_STACK}`,
//   { vpc },
// )
// postgresUrl: pulumi.interpolate`postgresql://${database.username}:${database.password}@${database.host}:${database.port}/${database.database}`,
