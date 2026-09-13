import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cartWhere, resolveCartOwner } from "@/lib/cart-owner"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const owner = await resolveCartOwner(false)
    if (!owner) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body: unknown = await request.json()
    const quantity =
      typeof body === "object" &&
      body !== null &&
      "quantity" in body &&
      typeof (body as { quantity: unknown }).quantity === "number"
        ? (body as { quantity: number }).quantity
        : 0

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return NextResponse.json({ error: "Quantity must be greater than 0" }, { status: 400 })
    }

    const updatedItem = await prisma.cartItem.updateMany({
      where: { id, ...cartWhere(owner) },
      data: { quantity },
    })

    if (updatedItem.count === 0) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 })
    }

    const item = await prisma.cartItem.findUnique({
      where: { id },
      include: { product: true },
    })

    return NextResponse.json({ message: "Quantity updated", item })
  } catch (error) {
    console.error("Cart item PATCH error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const owner = await resolveCartOwner(false)
    if (!owner) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const deleted = await prisma.cartItem.deleteMany({
      where: { id, ...cartWhere(owner) },
    })

    if (deleted.count === 0) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Item removed from cart" })
  } catch (error) {
    console.error("Cart item DELETE error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
