import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  getCompareAtDiscountPercent,
  hasCompareAtSale,
} from "@/lib/compare-at-price"

export interface ProductPriceDisplayProps {
  price: number
  compareAtPrice?: number
  size?: "sm" | "md" | "lg"
  className?: string
}

const priceSizeClasses = {
  sm: "text-sm font-semibold",
  md: "text-base md:text-lg font-bold",
  lg: "text-2xl font-bold",
} satisfies Record<NonNullable<ProductPriceDisplayProps["size"]>, string>

const compareSizeClasses = {
  sm: "text-xs text-muted-foreground line-through",
  md: "text-sm text-muted-foreground line-through",
  lg: "text-lg text-muted-foreground line-through",
} satisfies Record<NonNullable<ProductPriceDisplayProps["size"]>, string>

export function ProductPriceDisplay({
  price,
  compareAtPrice,
  size = "sm",
  className,
}: ProductPriceDisplayProps) {
  const isOnSale = hasCompareAtSale(price, compareAtPrice)
  const discountPercent = getCompareAtDiscountPercent(price, compareAtPrice)

  if (!isOnSale || compareAtPrice == null) {
    return (
      <div className={cn(priceSizeClasses[size], className)}>
        Rs. {price.toLocaleString()}
      </div>
    )
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className={priceSizeClasses[size]}>
        Rs. {price.toLocaleString()}
      </span>
      <span className={compareSizeClasses[size]}>
        Rs. {compareAtPrice.toLocaleString()}
      </span>
      {discountPercent != null ? (
        <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
          -{discountPercent}%
        </Badge>
      ) : null}
    </div>
  )
}
