export type ProductSize = "S" | "M" | "L"

export type SizeStockProduct = {
  requiresSizes?: boolean | null
  sizeSStock?: number | null
  sizeMStock?: number | null
  sizeLStock?: number | null
  sizeSSoldOut?: boolean | null
  sizeMSoldOut?: boolean | null
  sizeLSoldOut?: boolean | null
}

export function getSizeStock(
  product: SizeStockProduct,
  size: ProductSize
): number | null {
  if (size === "S") return product.sizeSStock ?? null
  if (size === "M") return product.sizeMStock ?? null
  return product.sizeLStock ?? null
}

/** Sold out when tracked stock is 0, or legacy sold-out flag when stock is unset. */
export function isSizeSoldOut(
  product: SizeStockProduct,
  size: ProductSize
): boolean {
  const stock = getSizeStock(product, size)
  if (typeof stock === "number") {
    return stock <= 0
  }
  if (size === "S") return !!product.sizeSSoldOut
  if (size === "M") return !!product.sizeMSoldOut
  return !!product.sizeLSoldOut
}

export function soldOutFlagsFromStock(input: {
  sizeSStock: number
  sizeMStock: number
  sizeLStock: number
}): {
  sizeSSoldOut: boolean
  sizeMSoldOut: boolean
  sizeLSoldOut: boolean
  allSizesSoldOut: boolean
} {
  const sizeSSoldOut = input.sizeSStock <= 0
  const sizeMSoldOut = input.sizeMStock <= 0
  const sizeLSoldOut = input.sizeLStock <= 0
  return {
    sizeSSoldOut,
    sizeMSoldOut,
    sizeLSoldOut,
    allSizesSoldOut: sizeSSoldOut && sizeMSoldOut && sizeLSoldOut,
  }
}

export function parseNonNegativeInt(value: unknown, fallback = 0): number {
  const n = typeof value === "number" ? value : Number(value)
  if (!Number.isFinite(n) || n < 0) return fallback
  return Math.floor(n)
}
