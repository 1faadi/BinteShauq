import Link from "next/link"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Truck, RefreshCw, Banknote, MessageCircle } from "lucide-react"
import { getProductImage, getFeaturedProducts, getProducts, type Product } from "@/lib/data"
import { getSidebarSections } from "@/lib/sidebar"
import { getHeroSettings, getHomeAboutSectionSettings, getStoreSettings } from "@/lib/settings"
import { ProductPriceDisplay } from "@/components/product-price-display"
import { ProductImage } from "@/components/product-image"
import { NewsletterForm } from "@/components/newsletter-form"
import { MainSidebar } from "@/components/main-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { SidebarWrapper } from "@/components/sidebar-wrapper"
import { SessionProvider } from "@/components/session-provider"
import { homepageHeroImageUrl } from "@/lib/cloudinary-url"
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
  let sidebarSections: Awaited<ReturnType<typeof getSidebarSections>> = []
  let heroSettings: Awaited<ReturnType<typeof getHeroSettings>> = null
  let homeAboutSettings: Awaited<ReturnType<typeof getHomeAboutSectionSettings>> = null
  let storeSettings: Awaited<ReturnType<typeof getStoreSettings>> = null

  try {
    ;[featuredProducts, sidebarSections, heroSettings, homeAboutSettings, storeSettings] =
      await Promise.all([
        getFeaturedProducts(),
        getSidebarSections(),
        getHeroSettings(),
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

  const heroLine1 = resolvedText(
    heroSettings?.heroLine1,
    "Premium Pakistani Women's Clothing"
  )
  const heroLine2 = resolvedText(
    heroSettings?.heroLine2,
    "Discover thoughtfully designed embroidered suits, kurtas and seasonal collections created for timeless everyday elegance."
  )
  const trimmedHeroImageUrl =
    typeof heroSettings?.heroImageUrl === "string" ? heroSettings.heroImageUrl.trim() : ""
  const heroImageSrc = homepageHeroImageUrl(
    trimmedHeroImageUrl !== "" ? trimmedHeroImageUrl : "/karandi-shawl-back.jpg"
  )
  const heroButtonText = heroSettings?.heroButtonText?.trim() || "Shop New Arrivals"
  const heroButtonHref = heroSettings?.heroButtonHref?.trim() || "/new-arrivals"

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
            <section className="relative w-full min-h-[70vh] md:min-h-[85vh] overflow-hidden">
              <ProductImage
                src={heroImageSrc}
                alt=""
                fill
                priority
                optimize={false}
                sizes="100vw"
                className="object-cover object-center"
              />
              <div
                className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/10"
                aria-hidden
              />
              <div className="relative z-10 flex min-h-[70vh] md:min-h-[85vh] items-center px-6 md:px-12 lg:px-16 xl:px-20 py-16 md:py-20">
                <div className="max-w-xl space-y-6 md:space-y-8">
                  <div className="space-y-3 md:space-y-4">
                    <h1 className="text-white text-3xl md:text-5xl font-light tracking-tight leading-tight drop-shadow-sm">
                      {heroLine1}
                    </h1>
                    <p className="text-white/90 text-base md:text-lg leading-relaxed drop-shadow-sm">
                      {heroLine2}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 pt-2 md:pt-4">
                    <Button
                      size="lg"
                      asChild
                      className="uppercase tracking-wider text-sm md:text-base px-6 md:px-8 py-5 md:py-6 bg-black text-white hover:bg-black/90"
                    >
                      <Link href={heroButtonHref}>{heroButtonText}</Link>
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      asChild
                      className="border-white text-white bg-transparent hover:bg-white/10"
                    >
                      <Link href="/shop">Explore the Collection</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </section>

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
                                <Link href={`/products/${product.slug}`}>View Details</Link>
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
