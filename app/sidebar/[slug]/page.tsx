import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { getProductImage } from "@/lib/data"
import { ArrowLeft } from "lucide-react"

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ id?: string }>
}

export default async function SidebarSectionPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { id } = await searchParams

  let section: any = null
  let products: any[] = []

  try {
    // Find section by ID if provided, otherwise by slug
    if (id) {
      section = await (prisma as any).sidebarSection.findUnique({
        where: { id },
        include: {
          items: {
            where: { isActive: true },
            include: {
              product: true
            },
            orderBy: { order: 'asc' }
          }
        }
      })
    } else {
      // Try to find by title slug
      const allSections = await (prisma as any).sidebarSection.findMany({
        where: { isActive: true },
        include: {
          items: {
            where: { isActive: true },
            include: {
              product: true
            },
            orderBy: { order: 'asc' }
          }
        }
      })
      
      section = allSections.find((s: any) => {
        const sectionSlug = s.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
        return sectionSlug === slug
      })
    }

    if (!section) {
      notFound()
    }

    // Get products from sidebar items
    products = section.items
      .filter((item: any) => item.product && item.product.inStock)
      .map((item: any) => item.product)
  } catch (error) {
    console.error("Error fetching sidebar section:", error)
    notFound()
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>
        <h1 className="text-3xl md:text-4xl font-bold uppercase">{section.title}</h1>
        <p className="text-muted-foreground mt-2">
          {products.length} {products.length === 1 ? 'product' : 'products'} available
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products available in this section.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {products.map((product) => (
            <Card key={product.id} className="group overflow-hidden">
              <div className="aspect-[3/4] relative overflow-hidden">
                <Image
                  src={getProductImage(product)}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm md:text-base">{product.name}</h3>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground mb-3 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-base md:text-lg font-bold">Rs. {product.price.toLocaleString()}</span>
                  <Button size="sm" asChild>
                    <Link href={`/products/${product.slug}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  )
}

