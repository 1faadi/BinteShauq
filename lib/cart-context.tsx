"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { trackAddToCart } from "@/lib/meta-pixel"
import { trackAnalytics } from "@/lib/analytics"

interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  image: string
  quantity: number
  size?: string
}

interface CartContextType {
  items: CartItem[]
  addToCart: (product: {
    id: string
    name: string
    price: number
    image: string
    size?: string
  }) => Promise<void>
  removeFromCart: (itemId: string) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  getTotalItems: () => number
  getTotalPrice: () => number
  isLoading: boolean
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { data: session, status } = useSession()
  const userId = session?.user?.id ?? null

  const loadCartItems = async (): Promise<void> => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/cart")
      if (response.ok) {
        const data: unknown = await response.json()
        const nextItems =
          typeof data === "object" &&
          data !== null &&
          "items" in data &&
          Array.isArray((data as { items: unknown }).items)
            ? ((data as { items: CartItem[] }).items ?? [])
            : []
        setItems(nextItems)
      }
    } catch (error) {
      console.error("Failed to load cart items:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (status === "loading") return
    void (async () => {
      if (userId) {
        try {
          await fetch("/api/cart/merge", { method: "POST" })
        } catch {
          // merge is best-effort
        }
      }
      await loadCartItems()
    })()
  }, [userId, status])

  const addToCart = async (product: {
    id: string
    name: string
    price: number
    image: string
    size?: string
  }): Promise<void> => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
          size: product.size ?? "",
        }),
      })

      if (response.ok) {
        await loadCartItems()
        trackAddToCart({
          id: product.id,
          name: product.name,
          price: product.price,
        })
        trackAnalytics("add_to_cart", {
          value: product.price,
          items: [
            {
              item_id: product.id,
              item_name: product.name,
              price: product.price,
              quantity: 1,
            },
          ],
        })
        toast.success("Added to cart!")
      } else {
        const error: unknown = await response.json()
        const msg =
          typeof error === "object" &&
          error !== null &&
          "error" in error &&
          typeof (error as { error: unknown }).error === "string"
            ? (error as { error: string }).error
            : "Failed to add to cart"
        toast.error(msg)
      }
    } catch {
      toast.error("Failed to add to cart")
    } finally {
      setIsLoading(false)
    }
  }

  const removeFromCart = async (itemId: string): Promise<void> => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/cart/items/${itemId}`, { method: "DELETE" })
      if (response.ok) {
        const removed = items.find((i) => i.id === itemId)
        await loadCartItems()
        if (removed) {
          trackAnalytics("remove_from_cart", {
            value: removed.price * removed.quantity,
            items: [
              {
                item_id: removed.productId,
                item_name: removed.name,
                price: removed.price,
                quantity: removed.quantity,
              },
            ],
          })
        }
        toast.success("Removed from cart")
      } else {
        toast.error("Failed to remove from cart")
      }
    } catch {
      toast.error("Failed to remove from cart")
    } finally {
      setIsLoading(false)
    }
  }

  const updateQuantity = async (itemId: string, quantity: number): Promise<void> => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/cart/items/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      })
      if (response.ok) {
        await loadCartItems()
      } else {
        toast.error("Failed to update quantity")
      }
    } catch {
      toast.error("Failed to update quantity")
    } finally {
      setIsLoading(false)
    }
  }

  const clearCart = async (): Promise<void> => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/cart", { method: "DELETE" })
      if (response.ok) {
        setItems([])
      } else {
        toast.error("Failed to clear cart")
      }
    } catch {
      toast.error("Failed to clear cart")
    } finally {
      setIsLoading(false)
    }
  }

  const getTotalItems = (): number =>
    items.reduce((total, item) => total + item.quantity, 0)

  const getTotalPrice = (): number =>
    items.reduce((total, item) => total + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        isLoading,
        refreshCart: loadCartItems,
      }}
    >
      <div aria-live="polite" className="sr-only">
        {isLoading ? "Updating cart" : `${getTotalItems()} items in cart`}
      </div>
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextType {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
