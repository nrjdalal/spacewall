/* eslint-disable @typescript-eslint/triple-slash-reference */

/// <reference path="./.sst/platform/config.d.ts" />

import pulumi from "@pulumi/pulumi"
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

    const vpc = new sst.aws.Vpc("MyVpc")
    const database = new sst.aws.Postgres(
      `spacewall${schema.PULUMI_NODEJS_STACK}`,
      { vpc },
    )

    return {
      fileBucketName: fileBucket.name,
      fileBucketArn: fileBucket.arn,
      postgresUrl: pulumi.interpolate`postgresql://${database.username}:${database.password}@${database.host}:${database.port}/${database.database}`,
    }
  },
})
