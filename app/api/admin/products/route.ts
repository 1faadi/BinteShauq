import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { allocateUniqueProductSlug } from "@/lib/allocate-unique-product-slug"
import { invalidateCachesAfterProductMutation } from "@/lib/invalidate-product-cache"
import {
  nullableTrimmedString,
  parseDupattaShawlKind,
} from "@/lib/product-field-utils"
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
      care,
      detailsCustom,
      dupattaShawlKind,
      dupattaShawlDetail,
      trousers,
      embellishment,
      washNote,
      isFeatured,
      isNewArrival,
      requiresSizes,
      sizeSSoldOut,
      sizeMSoldOut,
      sizeLSoldOut,
      sidebarSections // Array of sidebar section IDs
    } = body

    const slug = await allocateUniqueProductSlug(prisma, name)

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
        fabric: nullableTrimmedString(fabric),
        care: nullableTrimmedString(care),
        detailsCustom: nullableTrimmedString(detailsCustom),
        dupattaShawlKind: parseDupattaShawlKind(dupattaShawlKind),
        dupattaShawlDetail: nullableTrimmedString(dupattaShawlDetail),
        trousers: nullableTrimmedString(trousers),
        embellishment: nullableTrimmedString(embellishment),
        washNote:
          washNote === null ||
          washNote === undefined ||
          (typeof washNote === "string" && washNote.trim() === "")
            ? null
            : String(washNote).trim(),
        isFeatured: !!isFeatured,
        isNewArrival: !!isNewArrival,
        requiresSizes: requiresSizes !== undefined ? !!requiresSizes : true,
        sizeSSoldOut: !!sizeSSoldOut,
        sizeMSoldOut: !!sizeMSoldOut,
        sizeLSoldOut: !!sizeLSoldOut,
      },
    })

    // Create sidebar items for selected sections
    if (Array.isArray(sidebarSections) && sidebarSections.length > 0) {
      try {
        // Get the highest order number for each section to append new items
        const sectionOrders = await Promise.all(
          sidebarSections.map(async (sectionId: string) => {
            const lastItem = await (prisma as any).sidebarItem.findFirst({
              where: { sectionId },
              orderBy: { order: 'desc' },
            })
            return { sectionId, lastOrder: lastItem?.order ?? -1 }
          })
        )

        // Create sidebar items
        await Promise.all(
          sidebarSections.map(async (sectionId: string, index: number) => {
            const sectionOrder = sectionOrders.find(so => so.sectionId === sectionId)
            const order = (sectionOrder?.lastOrder ?? -1) + 1 + index
            
            await (prisma as any).sidebarItem.create({
              data: {
                sectionId,
                productId: product.id,
                label: product.name,
                order,
                isActive: true,
              },
            })
          })
        )
      } catch (error) {
        console.error("Error creating sidebar items:", error)
        // Don't fail the product creation if sidebar items fail
      }
    }

    // Clear timeout
    clearTimeout(timeoutId)

    invalidateCachesAfterProductMutation()

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

    invalidateCachesAfterProductMutation()

    return NextResponse.json({ success: true, message: "Product deleted successfully" })
  } catch (error) {
    console.error("Delete product error:", error)
    return NextResponse.json(
      { error: "Failed to delete product", details: (error as any).message },
      { status: 500 }
    )
  }
}
