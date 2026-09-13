import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cartWhere, resolveCartOwner } from "@/lib/cart-owner"
import { isSizeSoldOut, type ProductSize } from "@/lib/inventory"

function mapCartItems(
  cartItems: {
    id: string
    productId: string
    quantity: number
    size: string | null
    product: { name: string; price: number; images: string[]; inStock: boolean }
  }[]
) {
  return cartItems.map((item) => ({
    id: item.id,
    productId: item.productId,
    name: item.product.name,
    price: item.product.price,
    image: item.product.images[0] || "/placeholder.svg",
    quantity: item.quantity,
    size: item.size || undefined,
    inStock: item.product.inStock,
  }))
}

export async function GET(): Promise<NextResponse> {
  try {
    const owner = await resolveCartOwner(false)
    if (!owner) {
      return NextResponse.json({ items: [] })
    }

    const cartItems = await prisma.cartItem.findMany({
      where: cartWhere(owner),
      include: { product: true },
    })

    return NextResponse.json({ items: mapCartItems(cartItems) })
  } catch (error) {
    console.error("Cart GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const owner = await resolveCartOwner(true)
    if (!owner) {
      return NextResponse.json({ error: "Unable to create cart" }, { status: 500 })
    }

    const body: unknown = await request.json()
    const productId =
      typeof body === "object" &&
      body !== null &&
      "productId" in body &&
      typeof (body as { productId: unknown }).productId === "string"
        ? (body as { productId: string }).productId
        : ""
    const quantity =
      typeof body === "object" &&
      body !== null &&
      "quantity" in body &&
      typeof (body as { quantity: unknown }).quantity === "number"
        ? Math.max(1, Math.floor((body as { quantity: number }).quantity))
        : 1
    const sizeRaw =
      typeof body === "object" &&
      body !== null &&
      "size" in body &&
      typeof (body as { size: unknown }).size === "string"
        ? (body as { size: string }).size
        : ""
    const sizeVal = sizeRaw || ""

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
    if (!product.inStock) {
      return NextResponse.json({ error: "Product is out of stock" }, { status: 400 })
    }
    if (product.requiresSizes) {
      if (!sizeVal || !["S", "M", "L"].includes(sizeVal)) {
        return NextResponse.json({ error: "Please select a size" }, { status: 400 })
      }
      if (isSizeSoldOut(product, sizeVal as ProductSize)) {
        return NextResponse.json({ error: "Selected size is sold out" }, { status: 400 })
      }
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        ...cartWhere(owner),
        productId,
        size: sizeVal,
      },
    })

    if (existingItem) {
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      })
      return NextResponse.json({ message: "Cart updated", item: updatedItem })
    }

    const newItem = await prisma.cartItem.create({
      data: {
        userId: owner.type === "user" ? owner.userId : null,
        guestId: owner.type === "guest" ? owner.guestId : null,
        productId,
        quantity,
        size: sizeVal,
      },
    })

    return NextResponse.json({ message: "Item added to cart", item: newItem })
  } catch (error) {
    console.error("Cart POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(): Promise<NextResponse> {
  try {
    const owner = await resolveCartOwner(false)
    if (!owner) {
      return NextResponse.json({ message: "Cart cleared" })
    }
    await prisma.cartItem.deleteMany({ where: cartWhere(owner) })
    return NextResponse.json({ message: "Cart cleared" })
  } catch (error) {
    console.error("Cart DELETE error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
