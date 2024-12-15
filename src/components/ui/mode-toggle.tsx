"use client"

import { Switch } from "@/components/ui/switch"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ModeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      setTheme(mediaQuery.matches ? "dark" : "light")
    }
  }, [theme, setTheme])

  if (!mounted) return null

  return (
    <>
      <p>
        {theme === "dark" ? (
          <span className="flex items-center gap-2">
            <Moon className="size-4" /> Dark Mode
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Sun className="size-4" /> Light Mode
          </span>
        )}
      </p>
      <Switch
        checked={theme === "dark"}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
      />
    </>
  )
}
