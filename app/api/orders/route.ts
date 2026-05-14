import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getDeliveryChargePkr } from "@/lib/settings"

type OrderItemInput = {
  productId: string
  quantity: number
  price: number
}

function isOrderItemInput(x: unknown): x is OrderItemInput {
  if (x === null || typeof x !== "object") return false
  const o = x as Record<string, unknown>
  return (
    typeof o.productId === "string" &&
    o.productId.length > 0 &&
    typeof o.quantity === "number" &&
    Number.isFinite(o.quantity) &&
    o.quantity >= 1 &&
    Number.isInteger(o.quantity) &&
    typeof o.price === "number" &&
    Number.isFinite(o.price) &&
    o.price >= 0
  )
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const {
      items,
      paymentMethod,
      shippingAddress,
      billingAddress,
      phone,
      notes,
    } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in order" }, { status: 400 })
    }

    if (!Array.isArray(items) || !items.every(isOrderItemInput)) {
      return NextResponse.json({ error: "Invalid order items" }, { status: 400 })
    }

    const deliveryChargePkr = await getDeliveryChargePkr()
    let subtotal = 0
    for (const item of items) {
      subtotal += item.price * item.quantity
    }
    const total = subtotal + deliveryChargePkr

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total,
        paymentMethod,
        paymentStatus: paymentMethod === "cod" ? "PENDING" : "PENDING",
        shippingAddress,
        billingAddress,
        phone,
        notes,
        items: {
          create: items.map((item: OrderItemInput) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    // Clear cart after successful order
    await prisma.cartItem.deleteMany({
      where: { userId: session.user.id },
    })

    return NextResponse.json({ 
      message: "Order created successfully", 
      id: order.id,
      order 
    })
  } catch (error) {
    console.error("Order creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Orders fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
