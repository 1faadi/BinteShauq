import { Suspense } from "react"
import OrderDetailsPage from "./order-details-client"

export default function OrderPage(): React.ReactElement {
  return (
    <Suspense fallback={<div className="mx-auto max-w-4xl px-4 py-10">Loading order…</div>}>
      <OrderDetailsPage />
    </Suspense>
  )
}
