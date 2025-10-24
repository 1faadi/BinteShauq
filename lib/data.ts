import { prisma } from "./prisma"
import { cache } from "./cache"

export type Product = {
  id: string
  name: string
  slug: string
  collection: string
  price: number
  images: string[]
  imageData?: string | null // Base64 encoded images
  description: string
  inStock: boolean
  // Additional attributes from pd.md
  articleName?: string
  color?: string
  fabric?: string
  embroidery?: string
  shawlLength?: string
  suitFabric?: string
  usage?: string
  care?: string
  createdAt: string
  updatedAt: string
}

// Server-side functions for fetching products
export async function getProducts(sort?: string, collection?: string, limit?: number, includeImageData: boolean = false, featured?: boolean): Promise<Product[]> {
  try {
    // Create cache key
    const cacheKey = `products-${sort || 'default'}-${collection || 'all'}-${limit || 'all'}-${includeImageData ? 'with-images' : 'no-images'}-${featured ? 'featured' : 'all'}`
    
    // Try cache first
    const cached = cache.get<Product[]>(cacheKey)
    if (cached) {
      return cached
    }

    let whereClause: any = { inStock: true }
    
    if (collection) {
      whereClause.collection = collection
    }
    
    if (featured) {
      whereClause.isFeatured = true
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

    // Build select object dynamically to exclude imageData when not needed
    const selectFields: any = {
      id: true,
      name: true,
      slug: true,
      description: true,
      price: true,
      images: true,
      collection: true,
      inStock: true,
      isFeatured: true,
      isNewArrival: true,
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
    }

    // Only include imageData if specifically requested
    if (includeImageData) {
      selectFields.imageData = true
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy,
      take: limit || undefined,
      select: selectFields,
    })

    // Convert Date objects to strings and null to undefined for serialization
    const processedProducts: Product[] = products.map((product: any) => ({
      ...product,
      articleName: product.articleName ?? undefined,
      color: product.color ?? undefined,
      fabric: product.fabric ?? undefined,
      embroidery: product.embroidery ?? undefined,
      shawlLength: product.shawlLength ?? undefined,
      suitFabric: product.suitFabric ?? undefined,
      usage: product.usage ?? undefined,
      care: product.care ?? undefined,
      imageData: includeImageData ? (product.imageData ?? undefined) : undefined,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    }))

    // Cache for 2 minutes
    cache.set(cacheKey, processedProducts, 2 * 60 * 1000)
    
    return processedProducts
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export async function getBySlug(slug: string): Promise<Product | null> {
  try {
    // Try cache first
    const cacheKey = `product-${slug}`
    const cached = cache.get<Product>(cacheKey)
    if (cached) {
      return cached
    }

    const product = await prisma.product.findUnique({
      where: { slug },
    })

    if (!product) {
      return null
    }

    // Convert Date objects to strings and null to undefined for serialization
    const processedProduct = {
      ...product,
      articleName: product.articleName ?? undefined,
      color: product.color ?? undefined,
      fabric: product.fabric ?? undefined,
      embroidery: product.embroidery ?? undefined,
      shawlLength: product.shawlLength ?? undefined,
      suitFabric: product.suitFabric ?? undefined,
      usage: product.usage ?? undefined,
      care: product.care ?? undefined,
      imageData: product.imageData ?? undefined,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    }

    // Cache for 5 minutes
    cache.set(cacheKey, processedProduct, 5 * 60 * 1000)
    
    return processedProduct
  } catch (error) {
    console.error('Error fetching product by slug:', error)
    return null
  }
}

// Utility function to get the best available image for a product
export function getProductImage(product: Product, index: number = 0): string {
  // First try to get from imageData (base64)
  if (product.imageData) {
    try {
      const base64Images = JSON.parse(product.imageData)
      if (base64Images[index]) {
        return base64Images[index]
      }
    } catch (error) {
      console.error('Error parsing imageData:', error)
    }
  }
  
  // Fallback to images array (URLs)
  if (product.images && product.images[index]) {
    return product.images[index]
  }
  
  // Final fallback
  return '/placeholder.svg'
}

// Utility function to get all images for a product
export function getProductImages(product: Product): string[] {
  const images: string[] = []
  
  // First try to get from imageData (base64)
  if (product.imageData) {
    try {
      const base64Images = JSON.parse(product.imageData)
      images.push(...base64Images)
    } catch (error) {
      console.error('Error parsing imageData:', error)
    }
  }
  
  // Add fallback URLs if no base64 images
  if (images.length === 0 && product.images) {
    images.push(...product.images)
  }
  
  // Final fallback
  if (images.length === 0) {
    images.push('/placeholder.svg')
  }
  
  return images
}
