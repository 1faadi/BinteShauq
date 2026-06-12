"use client"

import NextTopLoader from "nextjs-toploader"

const BRAND_COLOR = "#3FA6B5"

export function TopProgressBar() {
  return (
    <NextTopLoader
      color={BRAND_COLOR}
      height={3}
      shadow={`0 0 10px ${BRAND_COLOR}, 0 0 5px ${BRAND_COLOR}`}
      showSpinner
      crawlSpeed={200}
      speed={200}
      easing="ease"
      zIndex={1600}
    />
  )
}
