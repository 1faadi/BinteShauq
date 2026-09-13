import { ProductCard } from "@/components/product-card"
import { getProductImages, getProductImage, getProducts } from "@/lib/data"
import type { Product } from "@/lib/data"

export const dynamic = "force-dynamic"

export default async function NewArrivalsPage(): Promise<React.ReactElement> {
  let items: Product[] = []

  try {
    const result = await getProducts({ sort: "newest", availability: "in-stock" })
    items = result.items.filter((item) => item.isNewArrival)
  } catch (error) {
    console.error("Error fetching new arrivals:", error)
    items = []
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="caps text-xl mb-6">New Arrivals</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
        {items.map((p) => (
          <ProductCard
            key={p.id}
            id={p.id}
            slug={p.slug}
            name={p.name}
            price={p.price}
            compareAtPrice={p.compareAtPrice}
            image={getProductImage(p)}
            images={getProductImages(p)}
          />
        ))}
      </div>
    </div>
  )
}
