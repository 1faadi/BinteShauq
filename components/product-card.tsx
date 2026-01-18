"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { useCart } from "@/lib/cart-context"
import { ShoppingCart, Eye } from "lucide-react"

type Props = {
  id: string
  slug: string
  name: string
  price?: number
  image?: string
  images?: string[]
  className?: string
  showAddToCart?: boolean
}

export function ProductCard({ id, slug, name, price, image, images, className, showAddToCart = true }: Props) {
  const [isHovered, setIsHovered] = useState(false)
  const [current, setCurrent] = useState(0)
  const { addToCart, isLoading } = useCart()

  const displayImages = (images && images.length > 0) ? images : [image ?? "/placeholder.svg?height=800&width=600&query=product%20image"]

  // Auto-advance slides every 3s (pause on hover)
  if (typeof window !== "undefined") {
    // simple guarded interval setup without useEffect to avoid SSR mismatch in this small component
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const React = require("react")
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      if (displayImages.length <= 1) return
      if (isHovered) return
      const timer = setInterval(() => {
        setCurrent((i) => (i + 1) % displayImages.length)
      }, 3000)
      return () => clearInterval(timer)
    }, [isHovered, displayImages.length])
  }

  const handleAddToCart = async (e: React.MouseEvent) => {
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
          {/* Slides */}
          <div className="absolute inset-0">
            {displayImages.map((src, idx) => (
              <Image
                key={idx}
                src={src}
                alt={name}
                width={600}
                height={800}
                className={cn(
                  "h-full w-full object-cover transition-opacity duration-500 absolute inset-0",
                  idx === current ? "opacity-100" : "opacity-0"
                )}
              />
            ))}
          </div>

          {/* Dots */}
          {displayImages.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {displayImages.map((_, idx) => (
                <button
                  key={idx}
                  aria-label={`Go to slide ${idx + 1}`}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrent(idx) }}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full transition-colors",
                    idx === current ? "bg-white" : "bg-white/50"
                  )}
                />
              ))}
            </div>
          )}
          
          {/* Hover overlay with buttons */}
          <div className={cn(
            "absolute inset-0 bg-black/20 flex items-center justify-center gap-2 transition-opacity duration-300",
            isHovered ? "opacity-100" : "opacity-0"
          )}>
            {showAddToCart && typeof price === "number" && (
              <Button
                size="sm"
                onClick={handleAddToCart}
                disabled={isLoading}
                className="bg-white text-black hover:bg-gray-100"
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                Add to Cart
              </Button>
            )}
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
        <div className="flex items-center justify-between mb-2">
          <div className="caps-tight text-xs font-medium">{name}</div>
          {typeof price === "number" ? (
            <div className="text-sm font-semibold">Rs. {price.toLocaleString()}</div>
          ) : null}
        </div>
        
        {showAddToCart && typeof price === "number" && (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleAddToCart}
            disabled={isLoading}
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            {isLoading ? "Adding..." : "Add to Cart"}
          </Button>
        )}
      </div>
    </div>
  )
}
