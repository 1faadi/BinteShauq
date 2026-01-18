import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Star, Truck, Shield, Headphones } from "lucide-react"
import { getProductImage, getProductsByCategories } from "@/lib/data"
import { getSidebarSections } from "@/lib/sidebar"
import { MainSidebar } from "@/components/main-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { SidebarWrapper } from "@/components/sidebar-wrapper"

// Make this page dynamic to avoid build-time database calls
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  let featuredProducts: any[] = []
  let sidebarSections: any[] = []
  
  try {
    // Get one product from each category/collection
    featuredProducts = await getProductsByCategories()
    // Get sidebar sections
    sidebarSections = await getSidebarSections()
  } catch (error) {
    console.error("Error fetching data:", error)
    // Fallback to empty array if database is not available
    featuredProducts = []
    sidebarSections = []
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <SidebarWrapper>
        <MainSidebar sections={sidebarSections} />
        <SidebarInset>
          {/* Hero Section - Full Width Edge to Edge */}
          <section className="relative w-full min-h-[70vh] md:min-h-[85vh] flex items-center bg-gradient-to-br from-gray-50 via-gray-100 to-white overflow-hidden">
            <div className="w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch min-h-[70vh] md:min-h-[85vh]">
                {/* Left Side - Text Content */}
                <div className="relative z-10 flex items-center px-6 md:px-12 lg:px-16 xl:px-20 py-12 md:py-16 order-2 lg:order-1">
                  <div className="space-y-6 md:space-y-8 w-full">
                    <div className="space-y-3 md:space-y-4">
                      <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-tight">
                        Premium Women's Wear
                      </h1>
                      <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold text-muted-foreground">
                        Karandi Shawls
                      </h2>
                    </div>
                    <div className="pt-4 md:pt-6">
                      <Button size="lg" asChild className="uppercase tracking-wider text-sm md:text-base px-6 md:px-8 py-5 md:py-6">
                        <Link href="/shop">
                          Shop Now
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Right Side - Image */}
                <div className="relative w-full h-[400px] md:h-[500px] lg:h-full order-1 lg:order-2">
                  <Image
                    src="/karandi-shawl-back.jpg"
                    alt="Karandi Shawl Collection"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </section>

          <main className="mx-auto max-w-6xl px-4">
      {/* Features Section */}
      <section className="py-8 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
              <Truck className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Fastest Shipping</h3>
            {/* <p className="text-sm text-muted-foreground">
              Fastest Shipping
            </p> */}
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Committed to exceptional quality</h3>
            {/* <p className="text-sm text-muted-foreground">
            Committed to exceptional quality — every fabric, stitch, and detail is carefully inspected to ensure lasting elegance and comfort in every piece."
            </p> */}
          </div>
          <div className="text-center sm:col-span-2 md:col-span-1">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
              <Headphones className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">24/7 Support</h3>
            {/* <p className="text-sm text-muted-foreground">
              Customer support available round the clock
            </p> */}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-8 md:py-16 border-t">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Featured Products</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto px-4">
            Handpicked selection of our most popular karandi shawls
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="group overflow-hidden">
              <div className="aspect-[3/4] relative overflow-hidden">
                <Image
                  src={getProductImage(product)}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm md:text-base">{product.name}</h3>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground mb-3 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-base md:text-lg font-bold">Rs. {product.price.toLocaleString()}</span>
                  <Button size="sm" asChild>
                    <Link href={`/products/${product.slug}`}>
                      View Details
                    </Link>
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
      </section>

      {/* About Section */}
      <section className="py-8 md:py-16 border-t">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">About Our Collection</h2>
            <p className="text-muted-foreground mb-4">
              Our karandi shawls are crafted with the finest materials and traditional techniques, 
              bringing together timeless elegance and modern comfort. Each piece is carefully 
              selected to ensure the highest quality and authentic craftsmanship.
            </p>
            <p className="text-muted-foreground mb-6">
              From the delicate beige tones to the rich midnight colors, our collection offers 
              something for every occasion and personal style preference.
            </p>
            <Button asChild>
              <Link href="/collections/blossom">
                Explore Collection
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="relative order-1 lg:order-2">
            <Image
              src="/karandi-shawl-detail.png"
              alt="Karandi Shawl Detail"
              width={600}
              height={400}
              className="rounded-lg object-cover w-full"
            />
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-8 md:py-16 border-t bg-muted/30">
        <div className="text-center max-w-2xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-muted-foreground mb-6">
            Subscribe to our newsletter to get the latest updates on new collections and exclusive offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border rounded-md"
            />
            <Button className="w-full sm:w-auto">Subscribe</Button>
          </div>
        </div>
      </section>
          </main>
        </SidebarInset>
      </SidebarWrapper>
    </SidebarProvider>
  )
}
