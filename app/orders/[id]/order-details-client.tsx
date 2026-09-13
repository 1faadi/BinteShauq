"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Package, Calendar, MapPin, Phone } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"

interface OrderItem {
  id: string
  quantity: number
  price: number
  size?: string | null
  product: {
    id: string
    name: string
    images: string[]
    description: string
  }
}

interface Order {
  id: string
  status: string
  total: number
  paymentMethod: string
  paymentStatus: string
  shippingAddress: string
  billingAddress: string
  phone: string
  notes: string
  createdAt: string
  updatedAt: string
  items: OrderItem[]
}

export default function OrderDetailsPage(): React.ReactElement | null {
  const params = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const guestEmail = searchParams.get("email")?.trim().toLowerCase() ?? ""
  const orderId = params.id

  useEffect(() => {
    if (status === "loading") return
    if (!session && !guestEmail) {
      router.push("/auth/signin")
      return
    }
    void fetchOrder()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status, orderId, guestEmail])

  const fetchOrder = async (): Promise<void> => {
    try {
      const qs = guestEmail ? `?email=${encodeURIComponent(guestEmail)}` : ""
      const response = await fetch(`/api/orders/${orderId}${qs}`)
      if (response.ok) {
        const data = (await response.json()) as { order: Order }
        setOrder(data.order)
      } else {
        toast.error("Failed to fetch order details")
        if (session) router.push("/orders")
      }
    } catch {
      toast.error("Failed to fetch order details")
      if (session) router.push("/orders")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (orderStatus: string): string => {
    switch (orderStatus.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-purple-100 text-purple-800"
      case "shipped":
        return "bg-indigo-100 text-indigo-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string): string =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  if (status === "loading" || isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse h-6 bg-muted rounded w-1/4" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <Card>
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-2">Order not found</h1>
            <Button asChild>
              <Link href="/shop">Continue shopping</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8">
        {session ? (
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/orders">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Link>
          </Button>
        ) : null}
        <h1 className="text-3xl font-bold mb-2">Order confirmation</h1>
        <p className="text-muted-foreground">
          Order #{order.id.slice(-8)} • {formatDate(order.createdAt)}
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="relative h-20 w-20 flex-shrink-0">
                    <Image
                      src={item.product.images[0] || "/placeholder.svg"}
                      alt={item.product.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-semibold">{item.product.name}</h2>
                    <p className="text-sm">
                      Qty: {item.quantity}
                      {item.size ? ` • Size ${item.size}` : ""}
                    </p>
                  </div>
                  <p className="font-semibold">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Total</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">Rs. {order.total.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-1">Includes delivery</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
              <p className="text-sm">
                {order.paymentMethod === "bank_transfer" ? "Bank Transfer" : "COD"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipping
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {order.shippingAddress}
              </p>
              {order.phone ? (
                <p className="text-sm mt-2 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {order.phone}
                </p>
              ) : null}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Placed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{formatDate(order.createdAt)}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
