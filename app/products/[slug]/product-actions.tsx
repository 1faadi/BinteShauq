"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ShoppingCart, CreditCard, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface ProductActionsProps {
  product: {
    id: string
    name: string
    price: number
    image: string
    inStock: boolean
    /** When false, PDP skips S/M/L (cart uses empty size). Default true if omitted. */
    requiresSizes?: boolean
    sizeSSoldOut?: boolean
    sizeMSoldOut?: boolean
    sizeLSoldOut?: boolean
  }
}

const SIZES = ["S", "M", "L"] as const

export function ProductActions({ product }: ProductActionsProps) {
  const { addToCart, isLoading: cartLoading } = useCart()
  const router = useRouter()
  const [isBuying, setIsBuying] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)

  const needsSizes = product.requiresSizes !== false
  const sizeSoldOut = {
    S: product.sizeSSoldOut ?? false,
    M: product.sizeMSoldOut ?? false,
    L: product.sizeLSoldOut ?? false,
  }
  const hasAvailableSize = needsSizes
    ? Object.values(sizeSoldOut).some((s) => !s)
    : true
  const canAddToCart =
    product.inStock &&
    hasAvailableSize &&
    (!needsSizes || (selectedSize !== null && !sizeSoldOut[selectedSize as keyof typeof sizeSoldOut]))

  const handleAddToCart = async () => {
    if (!canAddToCart) {
      if (needsSizes && selectedSize === null) {
        toast.error("Please select a size")
        return
      }
      if (
        needsSizes &&
        selectedSize !== null &&
        sizeSoldOut[selectedSize as keyof typeof sizeSoldOut]
      ) {
        toast.error("This size is sold out")
        return
      }
      toast.error("This product is out of stock")
      return
    }

    await addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: needsSizes ? selectedSize ?? undefined : undefined,
    })
  }

  const handleBuyNow = async () => {
    if (!canAddToCart) {
      if (needsSizes && selectedSize === null) {
        toast.error("Please select a size")
        return
      }
      toast.error("This product is unavailable")
      return
    }

    setIsBuying(true)
    try {
      await addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: needsSizes ? selectedSize ?? undefined : undefined,
      })
      router.push("/checkout")
    } catch (_error) {
      toast.error("Failed to proceed to checkout")
    } finally {
      setIsBuying(false)
    }
  }

  const isFullyOutOfStock = !product.inStock || (needsSizes && !hasAvailableSize)
  if (isFullyOutOfStock) {
    return (
      <div className="space-y-4">
        <Button size="lg" className="w-full" disabled>
          Out of Stock
        </Button>
        <p className="text-sm text-muted-foreground text-center">
          This product is currently unavailable
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {needsSizes && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Size</p>
          <div className="flex gap-2">
            {SIZES.map((size) => {
              const soldOut = sizeSoldOut[size]
              return (
                <div key={size} className="flex flex-col items-center gap-1">
                  <button
                    type="button"
                    onClick={() => !soldOut && setSelectedSize(size)}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-md border text-sm font-medium transition-colors",
                      soldOut
                        ? "cursor-not-allowed border-dashed border-muted bg-muted/50 text-muted-foreground opacity-60"
                        : selectedSize === size
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-input hover:border-primary hover:bg-accent"
                    )}
                  >
                    {size}
                  </button>
                  {soldOut && (
                    <span className="text-[10px] text-destructive">Sold Out</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
      <Button
        size="lg"
        className="w-full"
        onClick={handleAddToCart}
        disabled={cartLoading || !canAddToCart}
      >
        {cartLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adding...
          </>
        ) : (
          <>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </>
        )}
      </Button>
      
      <Button
        size="lg"
        variant="outline"
        className="w-full"
        onClick={handleBuyNow}
        disabled={cartLoading || isBuying || !canAddToCart}
      >
        {isBuying ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Buy Now
          </>
        )}
      </Button>
      
      <p className="text-xs text-muted-foreground text-center">
        Fastest Shipping
      </p>
    </div>
  )
}

