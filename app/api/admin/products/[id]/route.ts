import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const product = await prisma.product.findUnique({
      where: { id },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Product API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { 
      name, 
      description, 
      price, 
      collection, 
      images, 
      inStock,
      articleName,
      color,
      fabric,
      embroidery,
      shawlLength,
      suitFabric,
      usage,
      care,
      isFeatured,
      isNewArrival,
      imageData,
      uploadedImagesCount
    } = body

    // Generate slug from name if name is being updated
    let slug
    if (name) {
      slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
    }

    const updateData: any = {}
    if (name) updateData.name = name
    if (slug) updateData.slug = slug
    if (description) updateData.description = description
    if (price) updateData.price = parseInt(price)
    if (collection) updateData.collection = collection
    if (images) updateData.images = images
    if (typeof inStock === "boolean") updateData.inStock = inStock
    // Additional fields
    if (articleName !== undefined) updateData.articleName = articleName
    if (color !== undefined) updateData.color = color
    if (fabric !== undefined) updateData.fabric = fabric
    if (embroidery !== undefined) updateData.embroidery = embroidery
    if (shawlLength !== undefined) updateData.shawlLength = shawlLength
    if (suitFabric !== undefined) updateData.suitFabric = suitFabric
    if (usage !== undefined) updateData.usage = usage
    if (care !== undefined) updateData.care = care
    if (isFeatured !== undefined) updateData.isFeatured = !!isFeatured
    if (isNewArrival !== undefined) updateData.isNewArrival = !!isNewArrival
    if (imageData !== undefined) {
      updateData.imageData = imageData
      // Try to mirror imageData array into images[] for easier querying
      try {
        const parsed = JSON.parse(imageData)
        if (Array.isArray(parsed)) {
          updateData.images = parsed
        }
      } catch (_) {
        // ignore
      }
    }

    const { id } = await params
    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error("Update product error:", error)
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { inStock } = body

    const { id } = await params
    const product = await prisma.product.update({
      where: { id },
      data: { inStock },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error("Update product stock error:", error)
    return NextResponse.json(
      { error: "Failed to update product stock" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    await prisma.product.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete product error:", error)
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    )
  }
}
