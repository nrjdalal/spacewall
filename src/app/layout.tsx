import "./globals.css"
import Providers from "@/app/providers"
import { fontMono, fontSans } from "@/assets/fonts"
import { cn } from "@/lib/utils"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "SpaceWall",
  description: "Launching soon.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-dvh font-sans antialiased",
          fontSans.variable,
          fontMono.variable,
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
