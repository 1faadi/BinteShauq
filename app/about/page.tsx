import Image from "next/image"
import { Card } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:py-20">
      {/* Hero Section */}
      <div className="text-center mb-12 md:mb-16">
        <p className="text-sm md:text-base text-muted-foreground mb-4 tracking-wide uppercase">
          Our Story
        </p>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-light mb-6 tracking-tight">
          Stitching Stories of Grace
        </h1>
        <div className="h-px bg-border max-w-xs mx-auto" />
      </div>

      {/* Main Content */}
      <div className="space-y-8 md:space-y-12">
        {/* Image Section */}
        <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden border">
          <Image
            src="/karandi-shawl-back.jpg"
            alt="Bint-e-Shauq Collection"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Story Content */}
        <Card className="p-8 md:p-12 border-none shadow-lg">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg md:text-xl leading-relaxed mb-6">
              <span className="text-2xl md:text-3xl font-serif">B</span>int-e-Shauq is founded by <strong>Sadia Ismail</strong>, our brand is the realization of a dream that began long ago. A vision to create timeless pieces that celebrate grace, elegance, and the strength of women. As a woman entrepreneur and design graduate, our founder brings her deep understanding of elegance and craftsmanship to every creation.
            </p>

            <div className="h-px bg-border my-8" />

            <p className="text-base md:text-lg leading-relaxed text-muted-foreground mb-6">
              We specialize in premium-quality formal wear and customized designs, blending traditional charm with a refined, modern touch. Each piece is thoughtfully designed to embody sophistication and comfort, made for women who value elegance in every thread.
            </p>

            <p className="text-base md:text-lg leading-relaxed text-muted-foreground mb-6">
              Though we currently operate online only, our dedication to excellence remains unwavering. Customer care is our priority, and we ensure that every order receives personal attention and love—just as it would in a physical store.
            </p>

            <p className="text-base md:text-lg leading-relaxed italic font-medium text-foreground">
              This is more than fashion; it's a journey of creativity, dedication, and timeless style, created by a woman, for women who inspire.
            </p>
          </div>
        </Card>

        {/* Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-12">
          <div className="text-center p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Craftsmanship</h3>
            <p className="text-sm text-muted-foreground">
              Every piece is thoughtfully designed with attention to detail and quality
            </p>
          </div>
          <div className="text-center p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Elegance</h3>
            <p className="text-sm text-muted-foreground">
              Blending traditional charm with refined, modern sophistication
            </p>
          </div>
          <div className="text-center p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Excellence</h3>
            <p className="text-sm text-muted-foreground">
              Personal attention and care for every order, every customer
            </p>
          </div>
        </div>

        {/* Founder Section */}
        <div className="bg-muted/30 rounded-lg p-8 md:p-12 mt-12">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-sm uppercase tracking-wider text-muted-foreground mb-4">
              Founded by
            </p>
            <h2 className="text-3xl md:text-4xl font-light mb-4">
              Sadia Ismail
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              Woman Entrepreneur & Design Graduate
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

