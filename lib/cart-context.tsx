"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  image: string
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addToCart: (product: { id: string; name: string; price: number; image: string }) => Promise<void>
  removeFromCart: (productId: string) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  getTotalItems: () => number
  getTotalPrice: () => number
  isLoading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()

  // Load cart items on mount and when session changes
  useEffect(() => {
    if (session?.user) {
      loadCartItems()
    } else {
      setItems([])
    }
  }, [session])

  const loadCartItems = async () => {
    if (!session?.user) return

    try {
      setIsLoading(true)
      const response = await fetch("/api/cart")
      if (response.ok) {
        const data = await response.json()
        setItems(data.items || [])
      }
    } catch (error) {
      console.error("Failed to load cart items:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const addToCart = async (product: { id: string; name: string; price: number; image: string }) => {
    if (!session?.user) {
      toast.error("Please sign in to add items to cart")
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
        }),
      })

      if (response.ok) {
        await loadCartItems()
        toast.success("Added to cart!")
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to add to cart")
      }
    } catch (error) {
      toast.error("Failed to add to cart")
    } finally {
      setIsLoading(false)
    }
  }

  const removeFromCart = async (productId: string) => {
    if (!session?.user) return

    try {
      setIsLoading(true)
      const response = await fetch(`/api/cart/${productId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await loadCartItems()
        toast.success("Removed from cart")
      } else {
        toast.error("Failed to remove from cart")
      }
    } catch (error) {
      toast.error("Failed to remove from cart")
    } finally {
      setIsLoading(false)
    }
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!session?.user) return

    try {
      setIsLoading(true)
      const response = await fetch(`/api/cart/${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
      })

      if (response.ok) {
        await loadCartItems()
      } else {
        toast.error("Failed to update quantity")
      }
    } catch (error) {
      toast.error("Failed to update quantity")
    } finally {
      setIsLoading(false)
    }
  }

  const clearCart = async () => {
    if (!session?.user) return

    try {
      setIsLoading(true)
      const response = await fetch("/api/cart", {
        method: "DELETE",
      })

      if (response.ok) {
        setItems([])
        toast.success("Cart cleared")
      } else {
        toast.error("Failed to clear cart")
      }
    } catch (error) {
      toast.error("Failed to clear cart")
    } finally {
      setIsLoading(false)
    }
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

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
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
