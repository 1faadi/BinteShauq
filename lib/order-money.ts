export type OrderLineForBreakdown = {
  price: number
  quantity: number
}

export type OrderMoneyBreakdown = {
  subtotal: number
  deliveryChargePkr: number
  total: number
}

/** Prefer stored delivery snapshot; fall back to total − line items for older rows. */
export function getOrderMoneyBreakdown(order: {
  total: number
  deliveryChargePkr?: number | null
  items: OrderLineForBreakdown[]
}): OrderMoneyBreakdown {
  const itemsSubtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  )
  const stored =
    typeof order.deliveryChargePkr === "number" && Number.isFinite(order.deliveryChargePkr)
      ? Math.max(0, Math.floor(order.deliveryChargePkr))
      : null
  const deliveryChargePkr =
    stored !== null ? stored : Math.max(0, order.total - itemsSubtotal)

  return {
    subtotal: itemsSubtotal,
    deliveryChargePkr,
    total: order.total,
  }
}

export function formatDeliveryChargeLabel(deliveryChargePkr: number): string {
  return deliveryChargePkr > 0 ? `Rs. ${deliveryChargePkr.toLocaleString()}` : "Free"
}
