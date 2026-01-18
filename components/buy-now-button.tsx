"use client"

import { useState } from "react"

type LineItem = {
  name: string
  unitAmount: number
  quantity?: number
}

export function BuyNowButton({ item }: { item: LineItem }) {
  const [loading, setLoading] = useState(false)

  return (
    <button
      className="border border-border px-6 py-3 uppercase tracking-[0.3em]"
      disabled={loading}
      onClick={async () => {
        try {
          setLoading(true)
          const res = await fetch("/api/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: [item] }),
          })
          const data = await res.json()
          if (data?.url) {
            window.location.href = data.url
          }
        } finally {
          setLoading(false)
        }
      }}
    >
      {loading ? "Processing..." : "Shop Now"}
    </button>
  )
}
