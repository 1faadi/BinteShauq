"use client"

import { useCart } from "@/lib/cart-context"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { toast } from "sonner"
import { Logo } from "@/components/logo"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, getTotalPrice, isLoading } = useCart()
  const { data: session } = useSession()
  const router = useRouter()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  if (!session) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <Logo size={48} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Sign in to view your cart</h2>
            <p className="text-muted-foreground mb-6">
              Please sign in to add items to your cart and proceed with checkout.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/auth/signup">Create Account</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <Logo size={48} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Button asChild>
              <Link href="/shop">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      await removeFromCart(productId)
    } else {
      await updateQuantity(productId, newQuantity)
    }
  }

  const handleCheckout = async () => {
    setIsCheckingOut(true)
    try {
      // Use Next.js router for navigation to preserve cart state
      router.push("/checkout")
    } catch (error) {
      toast.error("Failed to proceed to checkout")
    } finally {
      setIsCheckingOut(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:py-10">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Shopping Cart</h1>
        <p className="text-muted-foreground">
          {items.length} {items.length === 1 ? "item" : "items"} in your cart
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="relative h-16 w-16 md:h-20 md:w-20 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm md:text-lg">{item.name}</h3>
                    <p className="text-muted-foreground text-xs md:text-sm">Rs. {item.price.toLocaleString()}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                      disabled={isLoading}
                    >
                      <Minus className="h-3 w-3 md:h-4 md:w-4" />
                    </Button>
                    <span className="w-6 md:w-8 text-center text-sm">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                      disabled={isLoading}
                    >
                      <Plus className="h-3 w-3 md:h-4 md:w-4" />
                    </Button>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-sm md:text-base">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.productId)}
                      disabled={isLoading}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs. {getTotalPrice().toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>Rs. 0</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>Rs. {getTotalPrice().toLocaleString()}</span>
              </div>
              
              <Button 
                className="w-full" 
                size="lg"
                onClick={handleCheckout}
                disabled={isCheckingOut || isLoading}
              >
                {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
              </Button>
              
              <Button variant="outline" className="w-full" asChild>
                <Link href="/shop">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
