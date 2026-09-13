"use client"

import { useState, useEffect, useId, useRef } from "react"
import { useSession } from "next-auth/react"
import { useCart } from "@/lib/cart-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Building2, Banknote } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"
import { trackAnalytics } from "@/lib/analytics"
import { trackPurchase } from "@/lib/meta-pixel"
import { PurchasePolicyNotice } from "@/components/purchase-policy-notice"
import { DEFAULT_COMMERCE_POLICY, type CommercePolicy } from "@/lib/commerce-policy"

function newIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return `order-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export default function CheckoutPage(): React.ReactElement | null {
  const { items, getTotalPrice, clearCart } = useCart()
  const { data: session } = useSession()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [deliveryChargePkr, setDeliveryChargePkr] = useState(
    DEFAULT_COMMERCE_POLICY.deliveryChargePkr
  )
  const [policy, setPolicy] = useState<CommercePolicy>(DEFAULT_COMMERCE_POLICY)
  const [policyAccepted, setPolicyAccepted] = useState(false)
  const [hasTrackedCheckout, setHasTrackedCheckout] = useState(false)
  const idempotencyKeyRef = useRef(newIdempotencyKey())
  const policyCheckboxId = useId()

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Pakistan",
    notes: "",
  })

  useEffect(() => {
    if (session?.user?.email) {
      setFormData((prev) =>
        prev.email ? prev : { ...prev, email: session.user?.email ?? "" }
      )
    }
  }, [session?.user?.email])

  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart")
    }
  }, [items, router])

  useEffect(() => {
    if (items.length === 0 || hasTrackedCheckout) return
    const value = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    trackAnalytics("begin_checkout", {
      value,
      items: items.map((item) => ({
        item_id: item.productId,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    })
    setHasTrackedCheckout(true)
  }, [items, hasTrackedCheckout])

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/store/delivery-charge")
        if (!res.ok) return
        const data: unknown = await res.json()
        if (data !== null && typeof data === "object" && "deliveryChargePkr" in data) {
          const n = (data as { deliveryChargePkr: unknown }).deliveryChargePkr
          if (typeof n === "number" && Number.isFinite(n) && n >= 0) {
            const charge = Math.floor(n)
            setDeliveryChargePkr(charge)
            setPolicy((prev) => ({ ...prev, deliveryChargePkr: charge }))
          }
        }
      } catch {
        // keep default
      }
    })()
  }, [])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handlePlaceOrder = async (): Promise<void> => {
    if (!policyAccepted) {
      toast.error("Please acknowledge the COD and exchange policies")
      return
    }

    const requiredFields = ["firstName", "lastName", "email", "phone", "address", "city"] as const
    const missingFields = requiredFields.filter((field) => !formData[field].trim())

    if (missingFields.length > 0) {
      toast.error(`Please fill in: ${missingFields.join(", ")}`)
      return
    }

    setIsProcessing(true)

    try {
      const orderData = {
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          size: item.size,
        })),
        paymentMethod,
        shippingAddress: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}, ${formData.country}`,
        billingAddress: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}, ${formData.country}`,
        phone: formData.phone,
        notes: formData.notes,
        guestEmail: session?.user?.id ? undefined : formData.email.trim(),
        idempotencyKey: idempotencyKeyRef.current,
        policyAccepted: true,
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      if (response.ok) {
        const result = (await response.json()) as {
          id: string
          order?: {
            total: number
            items: { productId: string; quantity: number; price: number }[]
          }
        }
        const placedItems =
          result.order?.items.map((item) => ({
            id: item.productId,
            quantity: item.quantity,
            price: item.price,
          })) ??
          items.map((item) => ({
            id: item.productId,
            quantity: item.quantity,
            price: item.price,
          }))

        trackPurchase({
          id: result.id,
          total: result.order?.total ?? getTotalPrice() + deliveryChargePkr,
          items: placedItems,
        })
        await clearCart()
        toast.success("Order placed successfully!")
        const emailQ = encodeURIComponent(
          (session?.user?.email || formData.email || "").trim().toLowerCase()
        )
        router.push(
          emailQ ? `/orders/${result.id}?email=${emailQ}` : `/orders/${result.id}`
        )
      } else {
        const error: unknown = await response.json()
        const message =
          typeof error === "object" &&
          error !== null &&
          "error" in error &&
          typeof (error as { error: unknown }).error === "string"
            ? (error as { error: string }).error
            : "Failed to place order"
        toast.error(message)
        idempotencyKeyRef.current = newIdempotencyKey()
      }
    } catch {
      toast.error("Failed to place order")
      idempotencyKeyRef.current = newIdempotencyKey()
    } finally {
      setIsProcessing(false)
    }
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:py-10">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Checkout</h1>
        <p className="text-muted-foreground">
          {session?.user
            ? "Complete your order details below"
            : "Checkout as a guest — no account required"}
        </p>
        {!session?.user ? (
          <p className="text-sm text-muted-foreground mt-2">
            Prefer an account?{" "}
            <Link href="/auth/signin" className="underline underline-offset-2">
              Sign in
            </Link>
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  autoComplete="email"
                />
                {!session?.user ? (
                  <p className="text-xs text-muted-foreground mt-1">
                    We&apos;ll use this to confirm your guest order.
                  </p>
                ) : null}
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="zipCode">Zip Code</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Order Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Any special instructions for your order..."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod" className="flex items-center gap-2 cursor-pointer">
                    <Banknote className="h-4 w-4" />
                    Cash on Delivery (COD)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                  <Label
                    htmlFor="bank_transfer"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Building2 className="h-4 w-4" />
                    Bank Transfer
                  </Label>
                </div>
              </RadioGroup>

              {paymentMethod === "cod" ? (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Pay the remaining balance in cash when your order is delivered. An
                    advance is required before dispatch.
                  </p>
                </div>
              ) : null}

              {paymentMethod === "bank_transfer" ? (
                <div className="mt-4 p-4 bg-muted rounded-lg border-2 border-primary/20">
                  <p className="font-semibold text-sm mb-3 uppercase tracking-wide">
                    Bank Details for Online Payments:
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium text-muted-foreground">Bank:</span>
                      <span className="font-semibold">HBL Bank</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-muted-foreground">Account Title:</span>
                      <span className="font-semibold">SADIA ISMAIL</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-muted-foreground">Account Number:</span>
                      <span className="font-semibold">50367106426261</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                      <span className="font-medium text-muted-foreground">IBAN:</span>
                      <span className="font-semibold">PK48HABB0050367106426261</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4 italic">
                    After making the payment, please share the transaction receipt along with
                    your Order ID at binteshauq@gmail.com and WhatsApp +92 371 1538953
                  </p>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 md:gap-4">
                  <div className="relative h-12 w-12 md:h-16 md:w-16 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm md:text-base">{item.name}</h4>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      Qty: {item.quantity} × Rs. {item.price.toLocaleString()}
                      {item.size ? ` · Size ${item.size}` : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm md:text-base">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rs. {getTotalPrice().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span>
                    {deliveryChargePkr > 0
                      ? `Rs. ${deliveryChargePkr.toLocaleString()}`
                      : "Free"}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>
                    Rs. {(getTotalPrice() + deliveryChargePkr).toLocaleString()}
                  </span>
                </div>
              </div>

              <PurchasePolicyNotice policy={policy} />

              <div className="flex items-start gap-2">
                <Checkbox
                  id={policyCheckboxId}
                  checked={policyAccepted}
                  onCheckedChange={(checked) => setPolicyAccepted(checked === true)}
                />
                <Label
                  htmlFor={policyCheckboxId}
                  className="text-sm font-normal leading-snug cursor-pointer"
                >
                  I understand the COD advance requirements and exchange policy (no refunds).
                </Label>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={() => void handlePlaceOrder()}
                disabled={isProcessing || !policyAccepted}
              >
                {isProcessing
                  ? "Processing..."
                  : `Place Order - Rs. ${(getTotalPrice() + deliveryChargePkr).toLocaleString()}`}
              </Button>

              <Button variant="outline" className="w-full" asChild>
                <Link href="/cart">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Cart
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
