import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import {
  getBySlug,
  getProductImage,
  getProductImages,
  getRelatedProducts,
} from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductImageCarousel } from "@/components/product-image-carousel"
import { ProductDetailsTable } from "@/components/product-details-table"
import { hasProductDetailsContent } from "@/lib/product-details"
import { ProductActions } from "./product-actions"
import { ProductPriceDisplay } from "@/components/product-price-display"
import { MetaViewContent } from "@/components/meta-view-content"
import { PurchasePolicyNotice } from "@/components/purchase-policy-notice"
import { ProductCard } from "@/components/product-card"
import { RecentlyViewed } from "@/components/recently-viewed"
import { getCommercePolicy } from "@/lib/get-commerce-policy"
import { buildPageMetadata, jsonLdScript } from "@/lib/seo/metadata"
import { breadcrumbJsonLd, productJsonLd } from "@/lib/seo/json-ld"
import { BRAND_NAME } from "@/lib/site"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export const dynamic = "force-dynamic"

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getBySlug(slug)
  if (!product) {
    return buildPageMetadata({
      title: `Product not found | ${BRAND_NAME}`,
      description: "This product could not be found.",
      path: `/products/${slug}`,
      noIndex: true,
    })
  }

  const image = getProductImage(product)
  const description =
    product.description.trim().slice(0, 160) ||
    `${product.name} from ${BRAND_NAME}`

  return buildPageMetadata({
    title: `${product.name} | ${BRAND_NAME}`,
    description,
    path: `/products/${product.slug}`,
    image,
  })
}

export default async function ProductPage({
  params,
}: ProductPageProps): Promise<React.ReactElement> {
  const { slug } = await params
  const product = await getBySlug(slug)

  if (!product) {
    notFound()
  }

  const [productImages, related, policy] = await Promise.all([
    Promise.resolve(getProductImages(product)),
    getRelatedProducts(product, 4),
    getCommercePolicy(),
  ])

  const descriptionParagraphs = product.description
    .split(/\n\n+/)
    .map((block) => block.trim())
    .filter((block) => block.length > 0)

  const showDetailsCard = hasProductDetailsContent(product)
  const collectionLabel =
    product.collection.charAt(0).toUpperCase() + product.collection.slice(1)

  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Shop", path: "/shop" },
      {
        name: collectionLabel,
        path: `/collections/${product.collection}`,
      },
      { name: product.name, path: `/products/${product.slug}` },
    ]),
    productJsonLd({
      name: product.name,
      description: product.description,
      slug: product.slug,
      images: productImages,
      price: product.price,
      inStock: product.inStock,
    }),
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 pb-28 md:pb-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
      />
      <MetaViewContent
        product={{
          id: product.id,
          name: product.name,
          price: product.price,
        }}
      />
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/shop">Shop</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/collections/${product.collection}`}>{collectionLabel}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        {product.articleName ? (
          <p className="text-lg text-muted-foreground">{product.articleName}</p>
        ) : null}
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline">{product.collection}</Badge>
          {product.color ? <Badge variant="secondary">{product.color}</Badge> : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          <ProductImageCarousel images={productImages} alt={product.name} />
        </div>

        <div className="space-y-6">
          <div>
            <div className="mb-4">
              <ProductPriceDisplay
                price={product.price}
                compareAtPrice={product.compareAtPrice}
                size="lg"
              />
            </div>
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
              sizeSStock: product.sizeSStock,
              sizeMStock: product.sizeMStock,
              sizeLStock: product.sizeLStock,
            }}
          />

          <PurchasePolicyNotice policy={policy} className="border-t pt-4" />
          <p className="text-sm">
            <Link href="/size-guide" className="underline underline-offset-2 hover:text-foreground">
              Size guide
            </Link>
          </p>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-16">
          <h2 className="text-2xl font-semibold mb-6">You may also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => (
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
        </section>
      ) : null}

      <RecentlyViewed
        product={{
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: productImages[0] || "/placeholder.svg",
        }}
      />
    </div>
  )
}
