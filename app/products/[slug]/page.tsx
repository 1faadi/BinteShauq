import { getBySlug, getProductImages } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductImageCarousel } from "@/components/product-image-carousel"
import { ProductDetailsTable } from "@/components/product-details-table"
import { hasProductDetailsContent } from "@/lib/product-details"
import { ProductActions } from "./product-actions"

// Make this page dynamic to avoid large static generation
export const dynamic = "force-dynamic"

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

  const descriptionParagraphs = product.description
    .split(/\n\n+/)
    .map((block) => block.trim())
    .filter((block) => block.length > 0)

  const showDetailsCard = hasProductDetailsContent(product)

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
        <div className="space-y-4">
          <ProductImageCarousel images={productImages} alt={product.name} />
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Rs. {product.price.toLocaleString()}</h2>
            <div className="space-y-2 text-muted-foreground">
              {descriptionParagraphs.length > 0 ? (
                descriptionParagraphs.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))
              ) : (
                <p className="whitespace-pre-wrap">{product.description}</p>
              )}
            </div>
            {product.washNote?.trim() ? (
              <div className="mt-2 text-xs text-orange-600 whitespace-pre-wrap">
                {product.washNote.trim()}
              </div>
            ) : null}
          </div>

          {showDetailsCard ? (
            <Card className="overflow-hidden">
              <CardHeader className="border-b bg-muted/20 pb-4">
                <CardTitle className="text-lg">Product Details</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ProductDetailsTable product={product} />
              </CardContent>
            </Card>
          ) : null}

          <ProductActions
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              image: productImages[0] || "/placeholder.svg",
              inStock: product.inStock,
              requiresSizes: product.requiresSizes,
              sizeSSoldOut: product.sizeSSoldOut,
              sizeMSoldOut: product.sizeMSoldOut,
              sizeLSoldOut: product.sizeLSoldOut,
            }}
          />
        </div>
      </div>
    </div>
  )
}
