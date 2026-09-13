"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ProductImage } from "@/components/product-image"
import { ProductPriceDisplay } from "@/components/product-price-display"

const STORAGE_KEY = "binteshauq-recently-viewed"
const MAX_ITEMS = 8

export type RecentlyViewedProduct = {
  id: string
  slug: string
  name: string
  price: number
  image: string
}

function isRecentlyViewedProduct(x: unknown): x is RecentlyViewedProduct {
  if (x === null || typeof x !== "object") return false
  const o = x as Record<string, unknown>
  return (
    typeof o.id === "string" &&
    typeof o.slug === "string" &&
    typeof o.name === "string" &&
    typeof o.price === "number" &&
    typeof o.image === "string"
  )
}

function readStore(): RecentlyViewedProduct[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isRecentlyViewedProduct)
  } catch {
    return []
  }
}

function writeStore(items: RecentlyViewedProduct[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_ITEMS)))
  } catch {
    // ignore quota / private mode
  }
}

export function RecentlyViewed({
  product,
}: {
  product: RecentlyViewedProduct
}): React.ReactElement | null {
  const [items, setItems] = useState<RecentlyViewedProduct[]>([])

  useEffect(() => {
    const existing = readStore().filter((p) => p.id !== product.id)
    const next = [product, ...existing].slice(0, MAX_ITEMS)
    writeStore(next)
    setItems(existing.slice(0, 4))
  }, [product.id, product.slug, product.name, product.price, product.image])

  if (items.length === 0) return null

  return (
    <section className="mt-16 border-t pt-10" aria-label="Recently viewed">
      <h2 className="text-2xl font-semibold mb-6">Recently viewed</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
        {items.map((item) => (
          <Link key={item.id} href={`/products/${item.slug}`} className="group block">
            <div className="relative aspect-[3/4] overflow-hidden border mb-2">
              <ProductImage
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <p className="caps-tight text-xs font-medium truncate">{item.name}</p>
            <ProductPriceDisplay price={item.price} size="sm" />
          </Link>
        ))}
      </div>
    </section>
  )
}
