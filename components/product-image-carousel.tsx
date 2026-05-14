"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export interface ProductImageCarouselProps {
  images: string[]
  alt: string
}

export function ProductImageCarousel({ images, alt }: ProductImageCarouselProps) {
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

  useEffect(() => {
    if (current >= safeImages.length) {
      setCurrent(0)
    }
  }, [current, safeImages.length])

  return (
    <div
      className="space-y-3"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg border">
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
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1">
            {safeImages.map((_, idx) => (
              <button
                key={idx}
                type="button"
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

      {safeImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {safeImages.map((src, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Show image ${idx + 1} of ${safeImages.length}`}
              onClick={() => setCurrent(idx)}
              className={cn(
                "relative h-20 w-16 shrink-0 overflow-hidden rounded-md border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                idx === current ? "ring-2 ring-primary ring-offset-2" : "hover:opacity-90"
              )}
            >
              <Image
                src={src}
                alt={`${alt} — thumbnail ${idx + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
