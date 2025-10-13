import { Suspense } from "react"
import { getProducts, getProductImage, getProductImages } from "@/lib/data"
import { ProductCard } from "@/components/product-card"
import { SortDropdown } from "@/components/sort-dropdown"

async function ShopContent() {
  const items = await getProducts()
  
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:py-10">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Shop</h1>
        <p className="text-muted-foreground">Discover our collection of karandi shawls</p>
      </div>
      <div className="mb-6">
        <SortDropdown />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
        {items.map((p) => (
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

export default function ShopPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShopContent />
    </Suspense>
  )
}
