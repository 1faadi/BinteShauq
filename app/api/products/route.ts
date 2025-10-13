import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sort = searchParams.get("sort")
    const collection = searchParams.get("collection")
    const featured = searchParams.get("featured")
    const isNew = searchParams.get("new")
    const limit = searchParams.get("limit")

    let whereClause: any = { inStock: true }
    
    if (collection) {
      whereClause.collection = collection
    }
    if (featured === 'true') {
      whereClause.isFeatured = true
    }
    if (isNew === 'true') {
      whereClause.isNewArrival = true
    }

    let orderBy: any = { createdAt: "desc" }
    
    switch (sort) {
      case "price-asc":
        orderBy = { price: "asc" }
        break
      case "price-desc":
        orderBy = { price: "desc" }
        break
      case "newest":
        orderBy = { createdAt: "desc" }
        break
      case "oldest":
        orderBy = { createdAt: "asc" }
        break
      default:
        break
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy,
      take: limit ? parseInt(limit) : undefined,
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        price: true,
        images: true,
        imageData: true,
        collection: true,
        inStock: true,
        articleName: true,
        color: true,
        fabric: true,
        embroidery: true,
        shawlLength: true,
        suitFabric: true,
        usage: true,
        care: true,
        createdAt: true,
        updatedAt: true,
      },
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
