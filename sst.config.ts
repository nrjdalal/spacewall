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
        PULUMI_NODEJS_STACK: z.enum(["dev"]),
      })
      .parse(process.env)

    const fileBucket = new sst.aws.Bucket(
      `spacewall-${schema.PULUMI_NODEJS_STACK}`,
      {
        access: "public",
        cors: {
          allowHeaders: ["*"],
          allowMethods: ["DELETE", "GET", "PUT"],
          allowOrigins: ["*"],
          exposeHeaders: [],
          maxAge: "0 seconds",
        },
      },
    )

    return {
      fileBucketName: fileBucket.name,
      fileBucketArn: fileBucket.arn,
    }
  },
})
