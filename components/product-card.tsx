"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { useCart } from "@/lib/cart-context"
import { ShoppingCart, Eye } from "lucide-react"
import { ProductPriceDisplay } from "@/components/product-price-display"
import { ProductImage } from "@/components/product-image"

export type ProductCardProps = {
  id: string
  slug: string
  name: string
  price?: number
  compareAtPrice?: number
  image?: string
  images?: string[]
  className?: string
  showAddToCart?: boolean
}

export function ProductCard({
  id,
  slug,
  name,
  price,
  compareAtPrice,
  image,
  images,
  className,
  showAddToCart = true,
}: ProductCardProps): React.ReactElement {
  const [isHovered, setIsHovered] = useState(false)
  const [current, setCurrent] = useState(0)
  const { addToCart, isLoading } = useCart()

  const displayImages =
    images && images.length > 0
      ? images
      : [image ?? "/placeholder.svg"]

  useEffect(() => {
    if (displayImages.length <= 1) return
    if (isHovered) return
    const timer = setInterval(() => {
      setCurrent((i) => (i + 1) % displayImages.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [isHovered, displayImages.length])

  const handleAddToCart = async (e: React.MouseEvent): Promise<void> => {
    e.preventDefault()
    e.stopPropagation()

    if (typeof price === "number") {
      await addToCart({
        id,
        name,
        price,
        image: image || "/placeholder.svg",
      })
    }
  }

  return (
    <div className={cn("group", className)}>
      <Link href={`/products/${slug}`} className="block">
        <div
          className="aspect-[3/4] w-full overflow-hidden border relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="absolute inset-0">
            {displayImages.map((src, idx) => (
              <ProductImage
                key={`${src}-${idx}`}
                src={src}
                alt={name}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                priority={idx === 0}
                className={cn(
                  "transition-opacity duration-500 absolute inset-0",
                  idx === current ? "opacity-100" : "opacity-0"
                )}
              />
            ))}
          </div>

          {displayImages.length > 1 ? (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {displayImages.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  aria-label={`Go to slide ${idx + 1}`}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setCurrent(idx)
                  }}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full transition-colors",
                    idx === current ? "bg-white" : "bg-white/50"
                  )}
                />
              ))}
            </div>
          ) : null}

          <div
            className={cn(
              "absolute inset-0 bg-black/20 flex items-center justify-center gap-2 transition-opacity duration-300",
              isHovered ? "opacity-100" : "opacity-0"
            )}
          >
            {showAddToCart && typeof price === "number" ? (
              <Button
                size="sm"
                onClick={(e) => void handleAddToCart(e)}
                disabled={isLoading}
                className="bg-white text-black hover:bg-gray-100"
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                Add to Cart
              </Button>
            ) : null}
            <Button
              size="sm"
              variant="outline"
              className="bg-white/90 text-black hover:bg-white"
            >
              <Eye className="h-4 w-4 mr-1" />
              Quick View
            </Button>
          </div>
        </div>
      </Link>

      <div className="mt-3">
        <div className="flex items-center justify-between mb-2 gap-2">
          <div className="caps-tight text-xs font-medium">{name}</div>
          {typeof price === "number" ? (
            <ProductPriceDisplay
              price={price}
              compareAtPrice={compareAtPrice}
              size="sm"
            />
          ) : null}
        </div>

        {showAddToCart && typeof price === "number" ? (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={(e) => void handleAddToCart(e)}
            disabled={isLoading}
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            {isLoading ? "Adding..." : "Add to Cart"}
          </Button>
        ) : null}
      </div>
    </div>
  )
}
