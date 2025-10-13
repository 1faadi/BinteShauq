"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { ShoppingCart, CreditCard, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface ProductActionsProps {
  product: {
    id: string
    name: string
    price: number
    image: string
    inStock: boolean
  }
}

export function ProductActions({ product }: ProductActionsProps) {
  const { addToCart, isLoading: cartLoading } = useCart()
  const router = useRouter()
  const [isBuying, setIsBuying] = useState(false)

  const handleAddToCart = async () => {
    if (!product.inStock) {
      toast.error("This product is out of stock")
      return
    }

    await addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    })
  }

  const handleBuyNow = async () => {
    if (!product.inStock) {
      toast.error("This product is out of stock")
      return
    }

    setIsBuying(true)
    try {
      // Add to cart first
      await addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image
      })
      
      // Then redirect to checkout
      router.push("/checkout")
    } catch (error) {
      toast.error("Failed to proceed to checkout")
    } finally {
      setIsBuying(false)
    }
  }

  if (!product.inStock) {
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
      <Button
        size="lg"
        className="w-full"
        onClick={handleAddToCart}
        disabled={cartLoading}
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
        disabled={cartLoading || isBuying}
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
        Free shipping on orders over Rs. 5,000
      </p>
    </div>
  )
}

