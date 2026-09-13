import type { Metadata } from "next"

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode
}): React.ReactElement {
  return <>{children}</>
}
