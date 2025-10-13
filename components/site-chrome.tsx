"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideChrome = pathname?.startsWith("/admin")

  return (
    <>
      {!hideChrome && <SiteHeader />}
      <main>{children}</main>
      {!hideChrome && <SiteFooter />}
    </>
  )
}


