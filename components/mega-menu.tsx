"use client"

import Link from "next/link"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function MegaMenu() {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button className="px-4 py-2 caps text-xs">Shop</button>
      <div
        className={cn(
          "absolute left-1/2 z-20 mt-2 -translate-x-1/2 rounded-md border bg-background p-4 shadow-sm",
          open ? "block" : "hidden",
        )}
      >
        <div className="grid grid-cols-2 gap-6 min-w-80">
          <div className="space-y-2">
            <div className="caps-tight text-[11px] opacity-60">Winter ’25</div>
            <Link href="/collections/karandi-shawl-suits" className="block text-sm hover:opacity-70">
              Karandi Shawl Suits
            </Link>
          </div>
          <div className="space-y-2">
            <div className="caps-tight text-[11px] opacity-60">Collections</div>
            <div className="flex flex-col">
              <Link href="/collections/blossom" className="py-1 text-sm hover:opacity-70">
                Blossom
              </Link>
              <Link href="/collections/linear" className="py-1 text-sm hover:opacity-70">
                Linear
              </Link>
              <Link href="/collections/flora" className="py-1 text-sm hover:opacity-70">
                Flora
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
