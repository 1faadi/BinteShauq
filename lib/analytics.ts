import { DEFAULT_CURRENCY } from "@/lib/site"
import { trackMetaEvent } from "@/lib/meta-pixel"

export type AnalyticsItem = {
  item_id: string
  item_name: string
  price: number
  quantity?: number
  item_category?: string
}

type AnalyticsPayload = {
  currency?: string
  value?: number
  items?: AnalyticsItem[]
  search_term?: string
  transaction_id?: string
}

function pushDataLayer(event: string, payload: AnalyticsPayload): void {
  if (typeof window === "undefined") return
  const w = window as Window & { dataLayer?: unknown[] }
  w.dataLayer = w.dataLayer ?? []
  w.dataLayer.push({ event, ...payload })
}

function toMetaContents(items?: AnalyticsItem[]) {
  return items?.map((item) => ({
    id: item.item_id,
    quantity: item.quantity ?? 1,
    item_price: item.price,
  }))
}

export function trackAnalytics(
  event: string,
  payload: AnalyticsPayload = {}
): void {
  const currency = payload.currency ?? DEFAULT_CURRENCY
  pushDataLayer(event, { ...payload, currency })

  const metaMap: Record<string, string> = {
    view_item: "ViewContent",
    add_to_cart: "AddToCart",
    begin_checkout: "InitiateCheckout",
    purchase: "Purchase",
    search: "Search",
  }
  const metaEvent = metaMap[event]
  if (metaEvent) {
    trackMetaEvent(metaEvent, {
      content_ids: payload.items?.map((i) => i.item_id),
      content_type: "product",
      contents: toMetaContents(payload.items),
      value: payload.value,
      currency: currency as "PKR",
      num_items: payload.items?.reduce((s, i) => s + (i.quantity ?? 1), 0),
    })
  }
}
