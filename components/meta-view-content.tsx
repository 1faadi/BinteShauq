"use client"

import { useEffect } from "react"
import { trackViewContent } from "@/lib/meta-pixel"

type MetaViewContentProps = {
  product: {
    id: string
    name: string
    price: number
  }
}

export function MetaViewContent({ product }: MetaViewContentProps): null {
  useEffect(() => {
    trackViewContent(product)
  }, [product.id, product.name, product.price])

  return null
}
