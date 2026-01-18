"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

type Props = {
  images: string[]
  alt: string
}

export function ProductImageCarousel({ images, alt }: Props) {
  const safeImages = images && images.length > 0 ? images : ["/placeholder.svg"]
  const [current, setCurrent] = useState(0)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    if (hovered) return
    if (safeImages.length <= 1) return
    const timer = setInterval(() => {
      setCurrent((i) => (i + 1) % safeImages.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [hovered, safeImages.length])

  return (
    <div
      className="relative aspect-[3/4] w-full overflow-hidden rounded-lg border"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {safeImages.map((src, idx) => (
        <Image
          key={idx}
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className={cn(
            "object-cover absolute inset-0 transition-opacity duration-500",
            idx === current ? "opacity-100" : "opacity-0"
          )}
          priority={idx === 0}
        />
      ))}

      {safeImages.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10">
          {safeImages.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Go to slide ${idx + 1}`}
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                idx === current ? "bg-white" : "bg-white/60"
              )}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setCurrent(idx)
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}


