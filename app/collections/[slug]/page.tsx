import Link from "next/link"
import { getProducts } from "@/lib/data"
import { ProductCard } from "@/components/product-card"
import { SortDropdown } from "@/components/sort-dropdown"

// Make this page dynamic to avoid large static generation
export const dynamic = 'force-dynamic'

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams?: Promise<{ sort?: string }>
}) {
  const { slug } = await params
  const sp = searchParams ? await searchParams : {}
  const sort = sp.sort

  const list = await getProducts(sort || undefined, slug)
  const items = Array.isArray(list) ? list : []

  // Capitalize collection name for display
  const collectionName = slug.charAt(0).toUpperCase() + slug.slice(1)

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">{collectionName} Collection</h1>
          <p className="text-muted-foreground">{items.length} products</p>
        </div>
        <SortDropdown />
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No products found in this collection.</p>
          <Link href="/shop" className="text-primary hover:underline">
            Browse all products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {items.map((p) => (
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
      )}
    </div>
  )
}
