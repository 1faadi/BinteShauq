export function hasCompareAtSale(
  price: number,
  compareAtPrice?: number | null,
): boolean {
  return compareAtPrice != null && compareAtPrice > price
}

export function getCompareAtDiscountPercent(
  price: number,
  compareAtPrice?: number | null,
): number | null {
  if (!hasCompareAtSale(price, compareAtPrice) || compareAtPrice == null) {
    return null
  }

  return Math.round((1 - price / compareAtPrice) * 100)
}

export function parseCompareAtPriceInput(
  value: number | string | null | undefined,
): number | null {
  if (value === null || value === undefined || value === "") {
    return null
  }

  const parsed = typeof value === "number" ? value : parseInt(String(value), 10)
  if (Number.isNaN(parsed) || parsed <= 0) {
    return null
  }

  return parsed
}
