export const META_CURRENCY = "PKR" as const

export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "963312506513383"

type Fbq = (...args: unknown[]) => void

type MetaContent = {
  id: string
  quantity: number
  item_price?: number
}

export type MetaEventParams = {
  content_ids?: string[]
  content_name?: string
  content_type?: "product" | "product_group"
  contents?: MetaContent[]
  currency?: typeof META_CURRENCY
  value?: number
  num_items?: number
}

function getFbq(): Fbq | undefined {
  if (typeof window === "undefined") return undefined
  return (window as Window & { fbq?: Fbq }).fbq
}

export function trackMetaEvent(event: string, params?: MetaEventParams): void {
  const fbq = getFbq()
  if (!fbq) return
  if (params) {
    fbq("track", event, params)
    return
  }
  fbq("track", event)
}

export function trackViewContent(product: {
  id: string
  name: string
  price: number
}): void {
  trackMetaEvent("ViewContent", {
    content_ids: [product.id],
    content_name: product.name,
    content_type: "product",
    value: product.price,
    currency: META_CURRENCY,
  })
}

export function trackAddToCart(product: {
  id: string
  name: string
  price: number
  quantity?: number
}): void {
  const quantity = product.quantity ?? 1
  trackMetaEvent("AddToCart", {
    content_ids: [product.id],
    content_name: product.name,
    content_type: "product",
    contents: [{ id: product.id, quantity, item_price: product.price }],
    value: product.price * quantity,
    currency: META_CURRENCY,
  })
}

export function trackInitiateCheckout(items: {
  id: string
  quantity: number
  price: number
}[]): void {
  const value = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  trackMetaEvent("InitiateCheckout", {
    content_ids: items.map((item) => item.id),
    content_type: "product",
    contents: items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      item_price: item.price,
    })),
    num_items: items.reduce((sum, item) => sum + item.quantity, 0),
    value,
    currency: META_CURRENCY,
  })
}

export function purchaseDedupeKey(orderId: string): string {
  return `meta_purchase_${orderId}`
}

/** Returns true once per orderId for this browser; false on revisits. */
export function claimPurchaseTracking(
  orderId: string,
  storage: Pick<Storage, "getItem" | "setItem"> = sessionStorage
): boolean {
  const key = purchaseDedupeKey(orderId)
  if (storage.getItem(key)) return false
  storage.setItem(key, "1")
  return true
}

export function trackPurchase(order: {
  id: string
  total: number
  items: { id: string; quantity: number; price: number }[]
}): void {
  if (!claimPurchaseTracking(order.id)) return

  trackMetaEvent("Purchase", {
    content_ids: order.items.map((item) => item.id),
    content_type: "product",
    contents: order.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      item_price: item.price,
    })),
    num_items: order.items.reduce((sum, item) => sum + item.quantity, 0),
    value: order.total,
    currency: META_CURRENCY,
  })
}

// ponytail: assert-based self-check (no test framework)
if (process.env.NODE_ENV === "test") {
  const mem = new Map<string, string>()
  const storage = {
    getItem: (k: string) => mem.get(k) ?? null,
    setItem: (k: string, v: string) => {
      mem.set(k, v)
    },
  }
  console.assert(claimPurchaseTracking("o1", storage) === true)
  console.assert(claimPurchaseTracking("o1", storage) === false)
  console.assert(purchaseDedupeKey("abc") === "meta_purchase_abc")
}
