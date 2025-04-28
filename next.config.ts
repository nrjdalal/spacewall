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
  async redirects() {
    return [
      {
        source: "/",
        destination: "/access",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
