import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
      },
    ],
  },
}

export default nextConfig
