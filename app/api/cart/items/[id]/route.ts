import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { quantity } = await request.json()

    if (quantity <= 0) {
      return NextResponse.json({ error: "Quantity must be greater than 0" }, { status: 400 })
    }

    const updatedItem = await prisma.cartItem.updateMany({
      where: {
        id,
        userId: session.user.id,
      },
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
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const deleted = await prisma.cartItem.deleteMany({
      where: {
        id,
        userId: session.user.id,
      },
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
