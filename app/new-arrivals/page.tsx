import { ProductCard } from "@/components/product-card"
import { getProductImages, getProductImage } from "@/lib/data"
import { prisma } from "@/lib/prisma"

// Make this page dynamic to avoid large static generation
export const dynamic = 'force-dynamic'

export default async function NewArrivalsPage() {
  let items: any[] = []
  
  try {
    items = await prisma.product.findMany({
      where: {
        isNewArrival: true,
        inStock: true,
      },
      orderBy: { createdAt: "desc" },
      // Only select necessary fields to reduce payload size
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        images: true,
        imageData: true,
        createdAt: true,
      },
    })
  } catch (error) {
    console.error("Error fetching new arrivals:", error)
    items = []
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="caps text-xl mb-6">New Arrivals</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
        {Array.isArray(items) && items.map((p: any) => (
          <ProductCard
            key={p.id}
            id={p.id}
            slug={p.slug}
            name={p.name}
            price={p.price}
            image={getProductImage(p)}
            images={getProductImages(p)}
          />
        ))}
      </div>
    </div>
  )
}
