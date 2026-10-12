"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { trackMetaEvent } from "@/lib/meta-pixel"

/** SPA PageView on route changes. Boot/init: MetaPixelBoot in root layout. */
export function MetaPixel(): null {
  const pathname = usePathname()

  useEffect(() => {
    trackMetaEvent("PageView")
  }, [pathname])

  return null
}
