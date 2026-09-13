type OrderCustomerSource = {
  guestEmail?: string | null
  user?: {
    name?: string | null
    email?: string | null
  } | null
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
    name: "Guest",
    email: order.guestEmail ?? "",
    isGuest: true,
  }
}
