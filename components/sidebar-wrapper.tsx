"use client"

import { useSidebar } from "./ui/sidebar"
import { setGlobalSidebarToggle } from "./sidebar-header-trigger"
import { useEffect } from "react"
import type React from "react"

// This component connects the SidebarProvider's toggle function to the global context
export function SidebarWrapper({ children }: { children: React.ReactNode }) {
  const { toggleSidebar } = useSidebar()

  useEffect(() => {
    // Set the global toggle function so the header can access it
    setGlobalSidebarToggle(toggleSidebar)
    
    // Cleanup on unmount
    return () => {
      setGlobalSidebarToggle(() => {})
    }
  }, [toggleSidebar])

  return <>{children}</>
}

