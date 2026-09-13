import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getDeliveryChargePkr, getStoreSettings } from "@/lib/settings"
import { cartWhere, resolveCartOwner } from "@/lib/cart-owner"
import { DEFAULT_COMMERCE_POLICY } from "@/lib/commerce-policy"
import {
  getSizeStock,
  isSizeSoldOut,
  soldOutFlagsFromStock,
  type ProductSize,
} from "@/lib/inventory"
import { invalidateCachesAfterProductMutation } from "@/lib/invalidate-product-cache"

type OrderItemInput = {
  productId: string
  quantity: number
  size?: string
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
    Number.isInteger(o.quantity)
  )
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions)
    const body: unknown = await request.json()
    if (body === null || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 })
    }

    const payload = body as Record<string, unknown>
    const items = payload.items
    const paymentMethod =
      typeof payload.paymentMethod === "string" ? payload.paymentMethod : ""
    const shippingAddress =
      typeof payload.shippingAddress === "string" ? payload.shippingAddress : ""
    const billingAddress =
      typeof payload.billingAddress === "string" ? payload.billingAddress : shippingAddress
    const phone = typeof payload.phone === "string" ? payload.phone : ""
    const notes = typeof payload.notes === "string" ? payload.notes : ""
    const guestEmail =
      typeof payload.guestEmail === "string" ? payload.guestEmail.trim().toLowerCase() : ""
    const idempotencyKey =
      typeof payload.idempotencyKey === "string" ? payload.idempotencyKey : undefined
    const policyAccepted = payload.policyAccepted === true

    if (!policyAccepted) {
      return NextResponse.json(
        { error: "Please acknowledge the COD and exchange policies" },
        { status: 400 }
      )
    }

    if (!["cod", "bank_transfer"].includes(paymentMethod)) {
      return NextResponse.json({ error: "Invalid payment method" }, { status: 400 })
    }

    if (!shippingAddress.trim() || !phone.trim()) {
      return NextResponse.json({ error: "Shipping address and phone are required" }, { status: 400 })
    }

    if (!session?.user?.id && !guestEmail) {
      return NextResponse.json(
        { error: "Email is required for guest checkout" },
        { status: 400 }
      )
    }

    if (!Array.isArray(items) || items.length === 0 || !items.every(isOrderItemInput)) {
      return NextResponse.json({ error: "Invalid order items" }, { status: 400 })
    }

    if (idempotencyKey) {
      const existing = await prisma.order.findUnique({ where: { idempotencyKey } })
      if (existing) {
        return NextResponse.json({
          message: "Order already created",
          id: existing.id,
          order: existing,
        })
      }
    }

    const deliveryChargePkr = await getDeliveryChargePkr()
    const settings = await getStoreSettings()
    const policy = {
      ...DEFAULT_COMMERCE_POLICY,
      deliveryChargePkr,
      codAdvancePkr: settings?.codAdvancePkr ?? DEFAULT_COMMERCE_POLICY.codAdvancePkr,
      codHighOrderThresholdPkr:
        settings?.codHighOrderThresholdPkr ?? DEFAULT_COMMERCE_POLICY.codHighOrderThresholdPkr,
      codHighOrderPercent:
        settings?.codHighOrderPercent ?? DEFAULT_COMMERCE_POLICY.codHighOrderPercent,
      exchangeWorkingDays:
        settings?.exchangeWorkingDays ?? DEFAULT_COMMERCE_POLICY.exchangeWorkingDays,
      deliveryEstimateText:
        settings?.deliveryEstimateText ?? DEFAULT_COMMERCE_POLICY.deliveryEstimateText,
    }

    const pricedItems: { productId: string; quantity: number; price: number; size: string }[] = []

    try {
      const order = await prisma.$transaction(async (tx) => {
        let subtotal = 0

        for (const item of items) {
          const product = await tx.product.findUnique({ where: { id: item.productId } })
          if (!product) {
            throw new Error(`Product not found: ${item.productId}`)
          }
          if (!product.inStock) {
            throw new Error(`${product.name} is out of stock`)
          }

          const sizeVal = item.size ?? ""
          if (product.requiresSizes) {
            if (!["S", "M", "L"].includes(sizeVal)) {
              throw new Error(`Please select a size for ${product.name}`)
            }
            const size = sizeVal as ProductSize
            if (isSizeSoldOut(product, size)) {
              throw new Error(`${product.name} size ${size} is sold out`)
            }
            const available = getSizeStock(product, size) ?? 0
            if (item.quantity > available) {
              throw new Error(
                `Only ${available} piece(s) of ${product.name} size ${size} left`
              )
            }

            const nextS = size === "S" ? available - item.quantity : product.sizeSStock
            const nextM = size === "M" ? available - item.quantity : product.sizeMStock
            const nextL = size === "L" ? available - item.quantity : product.sizeLStock
            const flags = soldOutFlagsFromStock({
              sizeSStock: nextS,
              sizeMStock: nextM,
              sizeLStock: nextL,
            })

            await tx.product.update({
              where: { id: product.id },
              data: {
                sizeSStock: nextS,
                sizeMStock: nextM,
                sizeLStock: nextL,
                sizeSSoldOut: flags.sizeSSoldOut,
                sizeMSoldOut: flags.sizeMSoldOut,
                sizeLSoldOut: flags.sizeLSoldOut,
                inStock: !flags.allSizesSoldOut,
              },
            })
          }

          pricedItems.push({
            productId: product.id,
            quantity: item.quantity,
            price: product.price,
            size: sizeVal,
          })
          subtotal += product.price * item.quantity
        }

        const total = subtotal + deliveryChargePkr

        return tx.order.create({
          data: {
            userId: session?.user?.id ?? null,
            guestEmail: session?.user?.id ? null : guestEmail,
            total,
            deliveryChargePkr,
            paymentMethod,
            paymentStatus: "PENDING",
            shippingAddress,
            billingAddress,
            phone,
            notes:
              notes +
              (paymentMethod === "cod"
                ? `\n[COD] Advance required per policy (Rs. ${policy.codAdvancePkr}+).`
                : ""),
            idempotencyKey: idempotencyKey || null,
            items: {
              create: pricedItems.map((line) => ({
                productId: line.productId,
                quantity: line.quantity,
                price: line.price,
                size: line.size || null,
              })),
            },
          },
          include: {
            items: { include: { product: true } },
          },
        })
      })

      const owner = await resolveCartOwner(false)
      if (owner) {
        await prisma.cartItem.deleteMany({ where: cartWhere(owner) })
      }

      try {
        await invalidateCachesAfterProductMutation()
      } catch {
        // cache invalidation is best-effort
      }

      return NextResponse.json({
        message: "Order created successfully",
        id: order.id,
        order,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to place order"
      if (
        message.includes("sold out") ||
        message.includes("out of stock") ||
        message.includes("Only ") ||
        message.includes("select a size") ||
        message.includes("not found")
      ) {
        return NextResponse.json({ error: message }, { status: 400 })
      }
      throw err
    }
  } catch (error) {
    console.error("Order creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: { include: { product: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Orders fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
