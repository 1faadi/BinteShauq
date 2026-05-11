"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import { PanelLeftIcon } from "lucide-react"

// Global toggle function that can be set from the sidebar
let globalToggleSidebar: (() => void) | null = null

export function setGlobalSidebarToggle(toggle: () => void) {
  globalToggleSidebar = toggle
}

// Trigger button component for the header
export function SidebarHeaderTrigger() {
  const pathname = usePathname()
  const isHomePage = pathname === "/"
  const [toggleFn, setToggleFn] = useState<(() => void) | null>(null)

  useEffect(() => {
    if (isHomePage) {
      // Check if the toggle function is available
      if (globalToggleSidebar) {
        setToggleFn(() => globalToggleSidebar)
      }

      // Also set up a listener for when it becomes available
      const checkInterval = setInterval(() => {
        if (globalToggleSidebar) {
          setToggleFn(() => globalToggleSidebar)
          clearInterval(checkInterval)
        }
      }, 50)

      return () => clearInterval(checkInterval)
    } else {
      setToggleFn(null)
    }
  }, [isHomePage])

  // Always show the button on home page, even if toggle isn't ready yet
  if (!isHomePage) {
    return null
  }

  const handleClick = () => {
    if (globalToggleSidebar) {
      globalToggleSidebar()
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="h-9 shrink-0 gap-2 border-primary/40 bg-background px-3 shadow-sm hover:bg-muted hover:border-primary/60"
      onClick={handleClick}
      aria-label="Open browse menu — shop categories and collections"
    >
      <PanelLeftIcon className="h-4 w-4 text-primary" aria-hidden />
      <span className="caps text-[11px] font-semibold tracking-wide text-foreground max-[380px]:hidden">
        Browse more
      </span>
    </Button>
  )
}

