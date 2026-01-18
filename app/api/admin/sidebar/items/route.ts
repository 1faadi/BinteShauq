import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// POST - Create a new sidebar item
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { sectionId, productId, label, href, image, order } = body

    if (!sectionId || !label) {
      return NextResponse.json(
        { error: "Section ID and label are required" },
        { status: 400 }
      )
    }

    // If productId is provided, verify it exists
    if (productId) {
      const product = await prisma.product.findUnique({
        where: { id: productId }
      })
      if (!product) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        )
      }
    }

    const item = await prisma.sidebarItem.create({
      data: {
        sectionId,
        productId: productId || null,
        label,
        href: href || null,
        image: image || null,
        order: order ?? 0,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            images: true,
          }
        }
      }
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error("Error creating sidebar item:", error)
    return NextResponse.json(
      { error: "Failed to create sidebar item" },
      { status: 500 }
    )
  }
}

// PUT - Update a sidebar item
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { id, sectionId, productId, label, href, image, order, isActive } = body

    if (!id) {
      return NextResponse.json(
        { error: "Item ID is required" },
        { status: 400 }
      )
    }

    // If productId is provided, verify it exists
    if (productId) {
      const product = await prisma.product.findUnique({
        where: { id: productId }
      })
      if (!product) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        )
      }
    }

    const item = await prisma.sidebarItem.update({
      where: { id },
      data: {
        ...(sectionId && { sectionId }),
        ...(productId !== undefined && { productId: productId || null }),
        ...(label && { label }),
        ...(href !== undefined && { href: href || null }),
        ...(image !== undefined && { image: image || null }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive }),
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            images: true,
          }
        }
      }
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error("Error updating sidebar item:", error)
    return NextResponse.json(
      { error: "Failed to update sidebar item" },
      { status: 500 }
    )
  }
}

// DELETE - Delete a sidebar item
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "Item ID is required" },
        { status: 400 }
      )
    }

    await prisma.sidebarItem.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting sidebar item:", error)
    return NextResponse.json(
      { error: "Failed to delete sidebar item" },
      { status: 500 }
    )
  }
}

