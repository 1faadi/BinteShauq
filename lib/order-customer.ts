type OrderCustomerSource = {
  guestEmail?: string | null
  shippingAddress?: string | null
  user?: {
    name?: string | null
    email?: string | null
  } | null
}

/** Checkout stores `${name}, ${address}, ${city}, ${country}` for guests. */
function guestNameFromShippingAddress(shippingAddress?: string | null): string | null {
  const name = shippingAddress?.split(",")[0]?.trim()
  return name || null
}

export function getOrderCustomer(order: OrderCustomerSource): {
  name: string
  email: string
  isGuest: boolean
} {
  if (order.user) {
    return {
      name: order.user.name?.trim() || "Customer",
      email: order.user.email ?? "",
      isGuest: false,
    }
  }

  return {
    name: guestNameFromShippingAddress(order.shippingAddress) || "Guest",
    email: order.guestEmail ?? "",
    isGuest: true,
  }
}
