import { ProductCard } from "@/components/product-card"
import { getProductImages } from "@/lib/data"
import { prisma } from "@/lib/prisma"

export default async function NewArrivalsPage() {
  const items = await prisma.product.findMany({
    where: {
      isNewArrival: true,
      inStock: true,
    },
    orderBy: { createdAt: "desc" },
  })
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
            image={p.images?.[0]}
            images={p.images}
          />
        ))}
      </div>
    </div>
  )
}
