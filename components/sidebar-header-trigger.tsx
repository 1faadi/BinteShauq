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
      variant="ghost"
      size="icon"
      className="size-7"
      onClick={handleClick}
      aria-label="Toggle Sidebar"
    >
      <PanelLeftIcon className="h-4 w-4" />
    </Button>
  )
}

