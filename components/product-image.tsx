"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { productCardImageUrl } from "@/lib/cloudinary-url"

const PLACEHOLDER = "/placeholder.svg"

export type ProductImageProps = {
  src: string
  alt: string
  fill?: boolean
  width?: number
  height?: number
  className?: string
  sizes?: string
  priority?: boolean
  /** Apply card-sized Cloudinary transforms (default true) */
  optimize?: boolean
}

export function ProductImage({
  src,
  alt,
  fill = false,
  width,
  height,
  className,
  sizes = "(max-width: 768px) 50vw, 25vw",
  priority = false,
  optimize = true,
}: ProductImageProps): React.ReactElement {
  const [failed, setFailed] = useState(false)
  const resolved = failed
    ? PLACEHOLDER
    : optimize
      ? productCardImageUrl(src || PLACEHOLDER)
      : src || PLACEHOLDER

  return (
    <Image
      src={resolved}
      alt={alt}
      fill={fill}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      sizes={sizes}
      priority={priority}
      loading={priority ? "eager" : "lazy"}
      className={cn("bg-muted object-cover", className)}
      onError={() => setFailed(true)}
    />
  )
}
