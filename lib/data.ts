import type { Prisma, Product as PrismaProduct } from "@prisma/client"
import { prisma } from "./prisma"
import { cache } from "./cache"

export type Product = {
  id: string
  name: string
  slug: string
  collection: string
  price: number
  compareAtPrice?: number
  images: string[]
  description: string
  inStock: boolean
  isFeatured?: boolean
  isNewArrival?: boolean
  articleName?: string
  color?: string
  fabric?: string
  embroidery?: string
  shawlLength?: string
  suitFabric?: string
  usage?: string
  care?: string
  detailsCustom?: string
  dupattaShawlKind?: string
  dupattaShawlDetail?: string
  trousers?: string
  embellishment?: string
  washNote?: string
  requiresSizes?: boolean
  sizeSSoldOut?: boolean
  sizeMSoldOut?: boolean
  sizeLSoldOut?: boolean
  sizeSStock?: number
  sizeMStock?: number
  sizeLStock?: number
  createdAt: string
  updatedAt: string
}

export type ProductQuery = {
  sort?: string
  collection?: string
  limit?: number
  featured?: boolean
  q?: string
  color?: string
  fabric?: string
  /** Default: in-stock only */
  availability?: "in-stock" | "out-of-stock" | "all"
  page?: number
  pageSize?: number
}

export type ProductQueryResult = {
  items: Product[]
  total: number
}

function mapProduct(product: PrismaProduct): Product {
  return {
    ...product,
    compareAtPrice: product.compareAtPrice ?? undefined,
    articleName: product.articleName ?? undefined,
    color: product.color ?? undefined,
    fabric: product.fabric ?? undefined,
    embroidery: product.embroidery ?? undefined,
    shawlLength: product.shawlLength ?? undefined,
    suitFabric: product.suitFabric ?? undefined,
    usage: product.usage ?? undefined,
    care: product.care ?? undefined,
    detailsCustom: product.detailsCustom ?? undefined,
    dupattaShawlKind: product.dupattaShawlKind ?? undefined,
    dupattaShawlDetail: product.dupattaShawlDetail ?? undefined,
    trousers: product.trousers ?? undefined,
    embellishment: product.embellishment ?? undefined,
    washNote: product.washNote ?? undefined,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  }
}

function buildWhere(query: ProductQuery): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {}

  if (query.collection) {
    where.collection = query.collection
  }

  if (query.featured) {
    where.isFeatured = true
  }

  if (query.color) {
    where.color = { equals: query.color, mode: "insensitive" }
  }

  if (query.fabric) {
    where.fabric = { equals: query.fabric, mode: "insensitive" }
  }

  const availability = query.availability ?? "in-stock"
  if (availability === "in-stock") {
    where.inStock = true
  } else if (availability === "out-of-stock") {
    where.inStock = false
  }

  const q = query.q?.trim()
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { articleName: { contains: q, mode: "insensitive" } },
      { color: { contains: q, mode: "insensitive" } },
      { fabric: { contains: q, mode: "insensitive" } },
      { collection: { contains: q, mode: "insensitive" } },
    ]
  }

  return where
}

function buildOrderBy(sort?: string): Prisma.ProductOrderByWithRelationInput[] {
  switch (sort) {
    case "price-asc":
      return [{ price: "asc" }]
    case "price-desc":
      return [{ price: "desc" }]
    case "newest":
      return [{ createdAt: "desc" }]
    case "oldest":
      return [{ createdAt: "asc" }]
    case "featured":
      return [{ isFeatured: "desc" }, { createdAt: "desc" }]
    default:
      return [{ isFeatured: "desc" }, { createdAt: "desc" }]
  }
}

export async function getProducts(query: ProductQuery = {}): Promise<ProductQueryResult> {
  try {
    const page = Math.max(1, query.page ?? 1)
    const pageSize = query.pageSize ?? query.limit
    const cacheKey = `products-v2-${JSON.stringify({
      ...query,
      page,
      pageSize: pageSize ?? "all",
    })}`

    const cached = cache.get<ProductQueryResult>(cacheKey)
    if (cached) {
      return cached
    }

    const where = buildWhere(query)
    const orderBy = buildOrderBy(query.sort)

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy,
        ...(pageSize
          ? { take: pageSize, skip: (page - 1) * pageSize }
          : query.limit
            ? { take: query.limit }
            : {}),
      }),
    ])

    const result: ProductQueryResult = {
      items: products.map(mapProduct),
      total,
    }

    cache.set(cacheKey, result, 2 * 60 * 1000)
    return result
  } catch (error) {
    console.error("Error fetching products:", error)
    return { items: [], total: 0 }
  }
}

/** Distinct filter values for shop/collection UIs */
export async function getProductFilterOptions(collection?: string): Promise<{
  collections: string[]
  colors: string[]
  fabrics: string[]
}> {
  try {
    const where: Prisma.ProductWhereInput = collection
      ? { collection, inStock: true }
      : { inStock: true }

    const [collections, colors, fabrics] = await Promise.all([
      prisma.product.findMany({
        where: { inStock: true },
        select: { collection: true },
        distinct: ["collection"],
        orderBy: { collection: "asc" },
      }),
      prisma.product.findMany({
        where: { ...where, color: { not: null } },
        select: { color: true },
        distinct: ["color"],
        orderBy: { color: "asc" },
      }),
      prisma.product.findMany({
        where: { ...where, fabric: { not: null } },
        select: { fabric: true },
        distinct: ["fabric"],
        orderBy: { fabric: "asc" },
      }),
    ])

    return {
      collections: collections.map((c) => c.collection).filter(Boolean),
      colors: colors
        .map((c) => c.color)
        .filter((c): c is string => typeof c === "string" && c.length > 0),
      fabrics: fabrics
        .map((f) => f.fabric)
        .filter((f): f is string => typeof f === "string" && f.length > 0),
    }
  } catch (error) {
    console.error("Error fetching filter options:", error)
    return { collections: [], colors: [], fabrics: [] }
  }
}

/** In-stock products with `isFeatured` for the home page (admin: Show on Home). */
export async function getFeaturedProducts(limit = 12): Promise<Product[]> {
  const { items } = await getProducts({
    sort: "newest",
    limit,
    featured: true,
  })
  return items
}

export async function getProductsByCategories(): Promise<Product[]> {
  try {
    const cacheKey = "products-by-categories"
    const cached = cache.get<Product[]>(cacheKey)
    if (cached) {
      return cached
    }

    const collections = await prisma.product.findMany({
      where: { inStock: true },
      select: { collection: true },
      distinct: ["collection"],
    })

    const products: Product[] = []
    for (const collection of collections) {
      const product = await prisma.product.findFirst({
        where: {
          collection: collection.collection,
          inStock: true,
        },
        orderBy: { createdAt: "desc" },
      })

      if (product) {
        products.push(mapProduct(product))
      }
    }

    cache.set(cacheKey, products, 2 * 60 * 1000)
    return products
  } catch (error) {
    console.error("Error fetching products by categories:", error)
    return []
  }
}

export async function getBySlug(slug: string): Promise<Product | null> {
  try {
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

    const processedProduct = mapProduct(product)
    cache.set(cacheKey, processedProduct, 5 * 60 * 1000)
    return processedProduct
  } catch (error) {
    console.error("Error fetching product by slug:", error)
    return null
  }
}

export async function getRelatedProducts(
  product: Product,
  limit = 4
): Promise<Product[]> {
  const { items } = await getProducts({
    collection: product.collection,
    sort: "featured",
    limit: limit + 1,
  })
  return items.filter((p) => p.id !== product.id).slice(0, limit)
}

export function getProductImage(product: Product, index: number = 0): string {
  if (product.images && product.images[index]) {
    return product.images[index]
  }
  return "/placeholder.svg"
}

export function getProductImages(product: Product): string[] {
  if (product.images && product.images.length > 0) {
    return product.images
  }
  return ["/placeholder.svg"]
}
