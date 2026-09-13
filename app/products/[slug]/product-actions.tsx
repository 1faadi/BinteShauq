"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { ShoppingCart, CreditCard, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { isSizeSoldOut } from "@/lib/inventory"
import { ProductPriceDisplay } from "@/components/product-price-display"

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
    sizeSStock?: number
    sizeMStock?: number
    sizeLStock?: number
  }
}

const SIZES = ["S", "M", "L"] as const
type SizeKey = (typeof SIZES)[number]

export function ProductActions({ product }: ProductActionsProps): React.ReactElement {
  const { addToCart, isLoading: cartLoading } = useCart()
  const router = useRouter()
  const [isBuying, setIsBuying] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined)
  const [sizeError, setSizeError] = useState("")

  const needsSizes = product.requiresSizes !== false
  const sizeSoldOut: Record<SizeKey, boolean> = {
    S: isSizeSoldOut(product, "S"),
    M: isSizeSoldOut(product, "M"),
    L: isSizeSoldOut(product, "L"),
  }
  const hasAvailableSize = needsSizes
    ? SIZES.some((s) => !sizeSoldOut[s])
    : true
  const selectedIsSoldOut =
    selectedSize !== undefined &&
    SIZES.includes(selectedSize as SizeKey) &&
    sizeSoldOut[selectedSize as SizeKey]

  const validateSize = (): boolean => {
    if (!needsSizes) return true
    if (selectedSize === undefined) {
      setSizeError("Please select a size")
      return false
    }
    if (selectedIsSoldOut) {
      setSizeError("This size is sold out")
      return false
    }
    setSizeError("")
    return true
  }

  const handleAddToCart = async (): Promise<void> => {
    if (!product.inStock || !hasAvailableSize) {
      toast.error("This product is out of stock")
      return
    }
    if (!validateSize()) return

    await addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: needsSizes ? selectedSize : undefined,
    })
  }

  const handleBuyNow = async (): Promise<void> => {
    if (!product.inStock || !hasAvailableSize) {
      toast.error("This product is unavailable")
      return
    }
    if (!validateSize()) return

    setIsBuying(true)
    try {
      await addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: needsSizes ? selectedSize : undefined,
      })
      router.push("/checkout")
    } catch {
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

  const sizePicker =
    needsSizes ? (
      <div className="space-y-2">
        <p className="text-sm font-medium" id="size-label">
          Size
        </p>
        <RadioGroup
          value={selectedSize}
          onValueChange={(value) => {
            setSelectedSize(value)
            setSizeError("")
          }}
          className="flex flex-row gap-2"
          aria-labelledby="size-label"
          aria-invalid={sizeError ? true : undefined}
          aria-describedby={sizeError ? "size-error" : undefined}
        >
          {SIZES.map((size) => {
            const soldOut = sizeSoldOut[size]
            return (
              <div key={size} className="flex flex-col items-center gap-1">
                <Label
                  htmlFor={`size-${size}`}
                  className={cn(
                    "flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border text-sm font-medium transition-colors",
                    soldOut &&
                      "cursor-not-allowed border-dashed border-muted bg-muted/50 text-muted-foreground opacity-60",
                    !soldOut &&
                      selectedSize === size &&
                      "border-primary bg-primary text-primary-foreground",
                    !soldOut &&
                      selectedSize !== size &&
                      "border-input hover:border-primary hover:bg-accent"
                  )}
                >
                  <RadioGroupItem
                    id={`size-${size}`}
                    value={size}
                    disabled={soldOut}
                    className="sr-only"
                  />
                  {size}
                </Label>
                {soldOut ? (
                  <span className="text-[10px] text-destructive">Sold Out</span>
                ) : null}
              </div>
            )
          })}
        </RadioGroup>
        {sizeError ? (
          <p id="size-error" className="text-sm text-destructive" role="alert">
            {sizeError}
          </p>
        ) : null}
      </div>
    ) : null

  const actionButtons = (
    <>
      <Button
        size="lg"
        className="w-full"
        onClick={() => void handleAddToCart()}
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
        onClick={() => void handleBuyNow()}
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
    </>
  )

  return (
    <>
      <div className="space-y-3">
        {sizePicker}
        {actionButtons}
        <p className="text-xs text-muted-foreground text-center">
          Nationwide delivery · Exchange within policy window
        </p>
      </div>

      {/* Sticky mobile ATC */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 p-3 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{product.name}</p>
            <ProductPriceDisplay price={product.price} size="sm" />
          </div>
          <Button
            size="lg"
            className="shrink-0"
            onClick={() => void handleAddToCart()}
            disabled={cartLoading}
          >
            {cartLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  )
}
