import Image from "next/image"
import Link from "next/link"
import { getBySlug, getProductImages } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductImageCarousel } from "@/components/product-image-carousel"
import { ProductActions } from "./product-actions"

// Make this page dynamic to avoid large static generation
export const dynamic = 'force-dynamic'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getBySlug(slug)

  if (!product) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20">
        <p>Product not found.</p>
      </div>
    )
  }

  const productImages = getProductImages(product)

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        {product.articleName && (
          <p className="text-lg text-muted-foreground">{product.articleName}</p>
        )}
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline">{product.collection}</Badge>
          {product.color && (
            <Badge variant="secondary">{product.color}</Badge>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Product Images */}
        <div className="space-y-4">
          <ProductImageCarousel images={productImages} alt={product.name} />
          {productImages.length > 1 && (
            <div className="grid grid-cols-3 gap-2">
              {productImages.slice(1, 4).map((src, i) => (
                <div key={i} className="relative aspect-square w-full overflow-hidden rounded-md border">
                  <Image
                    src={src || "/placeholder.svg"}
                    alt={`${product.name} image ${i + 2}`}
                    fill
                    sizes="(min-width: 1024px) 16vw, 33vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Rs. {product.price.toLocaleString()}</h2>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          {/* Product Specifications */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {product.fabric && (
                <div className="flex justify-between">
                  <span className="font-medium">Fabric:</span>
                  <span>{product.fabric}</span>
                </div>
              )}
              {product.embroidery && (
                <div className="flex justify-between">
                  <span className="font-medium">Embroidery:</span>
                  <span>{product.embroidery}</span>
                </div>
              )}
              {product.shawlLength && (
                <div className="flex justify-between">
                  <span className="font-medium">Shawl Length:</span>
                  <span>{product.shawlLength}</span>
                </div>
              )}
              {product.suitFabric && (
                <div className="flex justify-between">
                  <span className="font-medium">Suit Fabric:</span>
                  <span>{product.suitFabric}</span>
                </div>
              )}
              {product.usage && (
                <div className="flex justify-between">
                  <span className="font-medium">Usage:</span>
                  <span>{product.usage}</span>
                </div>
              )}
              {product.care && (
                <div className="flex justify-between">
                  <span className="font-medium">Care:</span>
                  <span>{product.care}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Product Actions */}
          <ProductActions 
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              image: productImages[0] || "/placeholder.svg",
              inStock: product.inStock
            }}
          />
        </div>
      </div>
    </div>
  )
}
