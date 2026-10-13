import Link from "next/link"
import { Button } from "@/components/ui/button"

export interface OrderPlacedSuccessProps {
  orderId: string
  orderHref?: string | null
}

export function OrderPlacedSuccess({
  orderId,
  orderHref,
}: OrderPlacedSuccessProps): React.ReactElement {
  const shortId = orderId.slice(-8).toUpperCase()

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center md:py-24">
      <div
        className="order-success-ring mb-8 flex h-24 w-24 items-center justify-center rounded-full"
        aria-hidden="true"
      >
        <svg
          className="order-success-check h-12 w-12"
          viewBox="0 0 52 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className="order-success-circle"
            cx="26"
            cy="26"
            r="24"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            className="order-success-tick"
            d="M14.5 27.5 L22.5 35 L37.5 18"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <p className="order-success-fade caps mb-3 text-xs text-muted-foreground [animation-delay:200ms]">
        Thank you
      </p>

      <h1 className="order-success-fade mb-4 font-[family-name:var(--font-playfair)] text-3xl tracking-tight text-foreground md:text-4xl [animation-delay:320ms]">
        Your order has been placed successfully!
      </h1>

      <p className="order-success-fade mb-6 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg [animation-delay:440ms]">
        Our team will contact you shortly to confirm your order.
      </p>

      <p className="order-success-fade mb-10 text-sm text-muted-foreground [animation-delay:560ms]">
        Order <span className="font-medium text-foreground">#{shortId}</span>
      </p>

      <div className="order-success-fade flex w-full flex-col gap-3 sm:w-auto sm:flex-row [animation-delay:680ms]">
        {orderHref ? (
          <Button size="lg" asChild>
            <Link href={orderHref}>View order details</Link>
          </Button>
        ) : null}
        <Button size="lg" variant={orderHref ? "outline" : "default"} asChild>
          <Link href="/shop">Continue shopping</Link>
        </Button>
      </div>
    </div>
  )
}
