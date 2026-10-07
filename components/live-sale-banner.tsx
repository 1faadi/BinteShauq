import Link from "next/link"
import { getCompareAtDiscountPercent } from "@/lib/compare-at-price"

export type LiveSaleItem = {
  name: string
  slug: string
  price: number
  compareAtPrice: number
}

export interface LiveSaleBannerProps {
  items: LiveSaleItem[]
}

export function LiveSaleBanner({ items }: LiveSaleBannerProps): React.ReactElement | null {
  if (items.length === 0) return null

  const labels = items.map((item) => {
    const pct = getCompareAtDiscountPercent(item.price, item.compareAtPrice)
    const discount = pct != null ? ` (−${pct}%)` : ""
    return { slug: item.slug, text: `${item.name}${discount}` }
  })

  // Duplicate for seamless CSS loop
  const track = [...labels, ...labels]

  return (
    <div
      className="bg-[var(--sale)] text-white border-b overflow-hidden"
      role="region"
      aria-label="Live sale offers"
    >
      <div className="flex items-center gap-3 px-2 py-2">
        <span className="shrink-0 rounded bg-white/15 px-2 py-0.5 text-[10px] md:text-xs font-semibold tracking-wider uppercase">
          Live Sale
        </span>
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="animate-marquee flex w-max gap-8 whitespace-nowrap text-xs md:text-sm tracking-wide motion-reduce:animate-none motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-x-4 motion-reduce:gap-y-1">
            {track.map((item, i) => (
              <Link
                key={`${item.slug}-${i}`}
                href={`/products/${item.slug}`}
                className={`hover:underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2${i >= labels.length ? " motion-reduce:hidden" : ""}`}
              >
                {item.text}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
