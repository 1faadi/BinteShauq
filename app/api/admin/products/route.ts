import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error("Products API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    // If imageData (base64 array JSON) is provided, also populate images[] with it
    let imagesArray = Array.isArray(images) ? images : []
    if (imageData) {
      try {
        const parsed = JSON.parse(imageData)
        if (Array.isArray(parsed)) {
          imagesArray = parsed
        }
      } catch (_) {
        // ignore parsing errors; fallback to provided images
      }
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: parseInt(price),
        collection,
        images: imagesArray,
        imageData: imageData || null,
        inStock: inStock ?? true,
        // Additional fields
        articleName,
        color,
        fabric,
        embroidery,
        shawlLength,
        suitFabric,
        usage,
        care,
        isFeatured: !!isFeatured,
        isNewArrival: !!isNewArrival,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error("Create product error:", error)
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    )
  }
}
