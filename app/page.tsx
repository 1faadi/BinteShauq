import Link from "next/link"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Truck, RefreshCw, Banknote, MessageCircle } from "lucide-react"
import { getProductImage, getFeaturedProducts, getProducts, getSaleProducts, type Product } from "@/lib/data"
import { getSidebarSections } from "@/lib/sidebar"
import { getHeroSlides, getHomeAboutSectionSettings, getStoreSettings } from "@/lib/settings"
import { ProductPriceDisplay } from "@/components/product-price-display"
import { ProductImage } from "@/components/product-image"
import { NewsletterForm } from "@/components/newsletter-form"
import { MainSidebar } from "@/components/main-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { SidebarWrapper } from "@/components/sidebar-wrapper"
import { SessionProvider } from "@/components/session-provider"
import { LiveSaleBanner } from "@/components/live-sale-banner"
import { HeroCarousel } from "@/components/hero-carousel"
import { buildPageMetadata, jsonLdScript } from "@/lib/seo/metadata"
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/json-ld"
import { DEFAULT_META } from "@/lib/site"
import { DEFAULT_COMMERCE_POLICY } from "@/lib/commerce-policy"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: DEFAULT_META.title,
    description: DEFAULT_META.description,
    path: "/",
  })
}

const DEFAULT_HOME_ABOUT_TITLE = "Stitching Stories of Grace"
const DEFAULT_HOME_ABOUT_P1 =
  "Bint-e-Shauq designs premium Pakistani women's clothing for everyday elegance—thoughtful silhouettes, refined embroidery, and fabrics chosen for comfort through the seasons."
const DEFAULT_HOME_ABOUT_P2 =
  "From stitched suits and kurtas to karandi shawl ensembles, each piece is created for women who value craftsmanship, modest luxury, and clothes that feel as considered as they look."
const DEFAULT_HOME_ABOUT_BUTTON = "Explore the Collection"
const DEFAULT_HOME_ABOUT_HREF = "/shop"
const DEFAULT_HOME_ABOUT_IMAGE = "/karandi-shawl-detail.png"
const DEFAULT_HOME_ABOUT_ALT = "Bint-e-Shauq embroidered ensemble detail"

function resolvedText(raw: string | null | undefined, fallback: string): string {
  if (typeof raw !== "string") return fallback
  const t = raw.trim()
  return t === "" ? fallback : t
}

export default async function HomePage(): Promise<React.ReactElement> {
  let featuredProducts: Product[] = []
  let saleProducts: Product[] = []
  let sidebarSections: Awaited<ReturnType<typeof getSidebarSections>> = []
  let heroSlidesResult: Awaited<ReturnType<typeof getHeroSlides>> = null
  let homeAboutSettings: Awaited<ReturnType<typeof getHomeAboutSectionSettings>> = null
  let storeSettings: Awaited<ReturnType<typeof getStoreSettings>> = null

  try {
    ;[
      featuredProducts,
      saleProducts,
      sidebarSections,
      heroSlidesResult,
      homeAboutSettings,
      storeSettings,
    ] = await Promise.all([
      getFeaturedProducts(),
      getSaleProducts(12),
      getSidebarSections(),
      getHeroSlides(),
      getHomeAboutSectionSettings(),
      getStoreSettings(),
    ])
    if (featuredProducts.length === 0) {
      const fallback = await getProducts({ sort: "newest", limit: 8 })
      featuredProducts = fallback.items
    }
  } catch (error) {
    console.error("Error fetching homepage data:", error)
  }

  const heroSlides = heroSlidesResult?.slides ?? []

  const liveSaleItems = saleProducts
    .filter(
      (p): p is Product & { compareAtPrice: number } =>
        typeof p.compareAtPrice === "number",
    )
    .map((p) => ({
      name: p.name,
      slug: p.slug,
      price: p.price,
      compareAtPrice: p.compareAtPrice,
    }))

  const homeAboutTitle = resolvedText(homeAboutSettings?.homeAboutTitle, DEFAULT_HOME_ABOUT_TITLE)
  const homeAboutP1 = resolvedText(homeAboutSettings?.homeAboutParagraph1, DEFAULT_HOME_ABOUT_P1)
  const homeAboutP2 = resolvedText(homeAboutSettings?.homeAboutParagraph2, DEFAULT_HOME_ABOUT_P2)
  const homeAboutBtn = resolvedText(homeAboutSettings?.homeAboutButtonText, DEFAULT_HOME_ABOUT_BUTTON)
  const homeAboutHref = resolvedText(homeAboutSettings?.homeAboutButtonHref, DEFAULT_HOME_ABOUT_HREF)
  const trimmedAboutImg =
    typeof homeAboutSettings?.homeAboutImageUrl === "string"
      ? homeAboutSettings.homeAboutImageUrl.trim()
      : ""
  const homeAboutImgSrc = trimmedAboutImg !== "" ? trimmedAboutImg : DEFAULT_HOME_ABOUT_IMAGE
  const homeAboutImgAlt = resolvedText(homeAboutSettings?.homeAboutImageAlt, DEFAULT_HOME_ABOUT_ALT)

  const deliveryText =
    storeSettings?.deliveryEstimateText?.trim() || DEFAULT_COMMERCE_POLICY.deliveryEstimateText
  const exchangeDays = storeSettings?.exchangeWorkingDays ?? DEFAULT_COMMERCE_POLICY.exchangeWorkingDays
  const instagramUrl = storeSettings?.storeInstagramUrl?.trim()
  const displayProducts = featuredProducts.slice(0, 8)

  const jsonLd = [
    organizationJsonLd({
      email: storeSettings?.storeEmail,
      phone: storeSettings?.storePhone,
    }),
    websiteJsonLd(),
  ]

  return (
    <SessionProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
      />
      <SidebarProvider defaultOpen={false}>
        <SidebarWrapper>
          <MainSidebar sections={sidebarSections} />
          <SidebarInset>
            <LiveSaleBanner items={liveSaleItems} />
            <HeroCarousel slides={heroSlides} />

            <div className="mx-auto max-w-6xl px-4">
              <section className="py-8 md:py-16 border-t" aria-labelledby="featured-heading">
                <div className="text-center mb-8 md:mb-12">
                  <h2 id="featured-heading" className="text-2xl md:text-3xl font-bold mb-4">
                    Featured Products
                  </h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto px-4">
                    A focused selection from the current season
                  </p>
                </div>
                {displayProducts.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8 px-4">
                    Featured items will appear here once they are marked in the admin catalog.
                  </p>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                      {displayProducts.map((product) => (
                        <Card key={product.id} className="group overflow-hidden">
                          <Link href={`/products/${product.slug}`} className="block">
                            <div className="aspect-[3/4] relative overflow-hidden bg-muted">
                              <ProductImage
                                src={getProductImage(product)}
                                alt={product.name}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                            </div>
                          </Link>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2 gap-2">
                              <h3 className="font-semibold text-sm md:text-base">
                                <Link
                                  href={`/products/${product.slug}`}
                                  className="hover:underline underline-offset-2"
                                >
                                  {product.name}
                                </Link>
                              </h3>
                            </div>
                            <p className="text-xs md:text-sm text-muted-foreground mb-3 line-clamp-2">
                              {product.description}
                            </p>
                            <div className="flex items-center justify-between gap-2">
                              <ProductPriceDisplay
                                price={product.price}
                                compareAtPrice={product.compareAtPrice}
                                size="md"
                              />
                              <Button size="sm" asChild>
                                <Link href={`/products/${product.slug}`}>Add to Cart</Link>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <div className="text-center mt-6 md:mt-8">
                      <Button variant="outline" asChild>
                        <Link href="/shop">
                          View All Products
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </>
                )}
              </section>

              <section className="py-8 md:py-16 border-t" aria-labelledby="benefits-heading">
                <h2 id="benefits-heading" className="sr-only">
                  Shopping benefits
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                  <div className="text-center space-y-2">
                    <Truck className="h-6 w-6 mx-auto text-primary" aria-hidden />
                    <h3 className="font-semibold text-sm">Nationwide delivery</h3>
                    <p className="text-sm text-muted-foreground">{deliveryText}</p>
                  </div>
                  <div className="text-center space-y-2">
                    <RefreshCw className="h-6 w-6 mx-auto text-primary" aria-hidden />
                    <h3 className="font-semibold text-sm">Exchange window</h3>
                    <p className="text-sm text-muted-foreground">
                      Exchange requests within {exchangeDays} working days. No refunds.
                    </p>
                  </div>
                  <div className="text-center space-y-2">
                    <Banknote className="h-6 w-6 mx-auto text-primary" aria-hidden />
                    <h3 className="font-semibold text-sm">Flexible payment</h3>
                    <p className="text-sm text-muted-foreground">
                      Cash on Delivery and bank transfer. COD advance applies as listed in policies.
                    </p>
                  </div>
                  <div className="text-center space-y-2">
                    <MessageCircle className="h-6 w-6 mx-auto text-primary" aria-hidden />
                    <h3 className="font-semibold text-sm">WhatsApp support</h3>
                    <p className="text-sm text-muted-foreground">
                      Sizing and order help via WhatsApp during business hours.
                    </p>
                  </div>
                </div>
              </section>

              <section className="py-8 md:py-16 border-t" aria-labelledby="brand-heading">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
                  <div className="order-2 lg:order-1">
                    <h2
                      id="brand-heading"
                      className="text-2xl md:text-3xl font-bold mb-4 md:mb-6"
                    >
                      {homeAboutTitle}
                    </h2>
                    <p className="text-muted-foreground mb-4">{homeAboutP1}</p>
                    <p className="text-muted-foreground mb-6">{homeAboutP2}</p>
                    <Button asChild>
                      <Link href={homeAboutHref}>
                        {homeAboutBtn}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  <div className="relative order-1 lg:order-2 aspect-[3/2] w-full overflow-hidden rounded-lg border bg-muted">
                    <ProductImage
                      src={homeAboutImgSrc}
                      alt={homeAboutImgAlt}
                      fill
                      optimize={false}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              </section>

              {instagramUrl ? (
                <section className="py-8 md:py-16 border-t text-center">
                  <h2 className="text-2xl font-bold mb-3">On Instagram</h2>
                  <p className="text-muted-foreground mb-6">
                    See how customers style Bint-e-Shauq.
                  </p>
                  <Button variant="outline" asChild>
                    <Link href={instagramUrl} target="_blank" rel="noopener noreferrer">
                      Follow @bint_e_shauq
                    </Link>
                  </Button>
                </section>
              ) : null}

              <section className="py-8 md:py-16 border-t bg-muted/30" aria-labelledby="newsletter-heading">
                <div className="text-center max-w-2xl mx-auto px-4">
                  <h2 id="newsletter-heading" className="text-2xl md:text-3xl font-bold mb-4">
                    Stay Updated
                  </h2>
                  <NewsletterForm />
                </div>
              </section>
            </div>
          </SidebarInset>
        </SidebarWrapper>
      </SidebarProvider>
    </SessionProvider>
  )
}
