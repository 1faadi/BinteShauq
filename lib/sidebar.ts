import { prisma } from "./prisma"
import { cache } from "./cache"

export type SidebarSection = {
  id: string
  title: string
  order: number
  isActive: boolean
  items: SidebarItem[]
  createdAt: string
  updatedAt: string
}

export type SidebarItem = {
  id: string
  sectionId: string
  productId: string | null
  label: string
  href: string | null
  image: string | null
  order: number
  isActive: boolean
  product?: {
    id: string
    name: string
    slug: string
    price: number
    images: string[]
  }
  createdAt: string
  updatedAt: string
}

// Fetch all active sidebar sections with their items
export async function getSidebarSections(): Promise<SidebarSection[]> {
  try {
    const cacheKey = 'sidebar-sections'
    
    // Try cache first
    const cached = cache.get<SidebarSection[]>(cacheKey)
    if (cached) {
      return cached
    }

    // Try to access the model - if it doesn't exist, Prisma client needs regeneration
    // Check if the model exists (Prisma client might not be regenerated)
    if (!(prisma as any).sidebarSection) {
      console.warn('SidebarSection model not available. Please run: npx prisma generate && npx prisma db push')
      return []
    }

    const sections = await (prisma as any).sidebarSection.findMany({
      where: { isActive: true },
      include: {
        items: {
          where: { isActive: true },
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
          },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    })

    // Convert Date objects to strings
    const processedSections: SidebarSection[] = sections.map((section) => ({
      ...section,
      items: section.items.map((item) => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      })),
      createdAt: section.createdAt.toISOString(),
      updatedAt: section.updatedAt.toISOString(),
    }))

    // Cache for 5 minutes
    cache.set(cacheKey, processedSections, 5 * 60 * 1000)
    
    return processedSections
  } catch (error) {
    console.error('Error fetching sidebar sections:', error)
    return []
  }
}

