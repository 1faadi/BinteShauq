"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

const OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Newest", value: "newest" },
]

export function SortDropdown() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const value = params.get("sort") ?? "featured"

  function onChange(next: string) {
    const p = new URLSearchParams(params.toString())
    p.set("sort", next)
    router.push(`${pathname}?${p.toString()}`)
  }

  return (
    <label className="inline-flex items-center gap-2">
      <span className="sr-only">Sort by</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="caps text-[11px] border px-4 py-2 bg-background"
        aria-label="Sort by"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}
