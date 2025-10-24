import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

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
  // Set timeout for large uploads
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 60000) // 60 seconds
  
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
      images, // Array of Cloudinary URLs
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
      isNewArrival
    } = body

    // Generate unique slug from name
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
    
    // Check if slug exists and make it unique
    let slug = baseSlug
    let counter = 1
    while (true) {
      const existingProduct = await prisma.product.findUnique({
        where: { slug }
      })
      if (!existingProduct) break
      slug = `${baseSlug}-${counter}`
      counter++
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: parseInt(price),
        collection,
        images: Array.isArray(images) ? images : [],
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

    // Clear timeout
    clearTimeout(timeoutId)

    return NextResponse.json(product)
  } catch (error) {
    console.error("Create product error:", error)
    
    // Clear timeout on error
    clearTimeout(timeoutId)
    
    // Provide more specific error messages
    if ((error as any).code === 'P2002') {
      return NextResponse.json(
        { error: "A product with this name already exists" },
        { status: 409 }
      )
    }
    
    if ((error as any).name === 'AbortError') {
      return NextResponse.json(
        { error: "Request timeout - try uploading fewer images or smaller file sizes" },
        { status: 408 }
      )
    }
    
    return NextResponse.json(
      { error: "Failed to create product", details: (error as any).message },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('id')

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    // Get the product first to access its images
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { images: true }
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      try {
        const deletePromises = product.images.map(async (imageUrl) => {
          // Extract public_id from Cloudinary URL
          const publicId = imageUrl.split('/').pop()?.split('.')[0]
          if (publicId) {
            return cloudinary.uploader.destroy(`binteshauq/products/${publicId}`)
          }
        })

        await Promise.all(deletePromises)
      } catch (cloudinaryError) {
        console.error('Error deleting images from Cloudinary:', cloudinaryError)
        // Continue with product deletion even if Cloudinary deletion fails
      }
    }

    // Delete the product from database
    await prisma.product.delete({
      where: { id: productId }
    })

    return NextResponse.json({ success: true, message: "Product deleted successfully" })
  } catch (error) {
    console.error("Delete product error:", error)
    return NextResponse.json(
      { error: "Failed to delete product", details: (error as any).message },
      { status: 500 }
    )
  }
}
