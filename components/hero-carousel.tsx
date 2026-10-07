"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProductImage } from "@/components/product-image"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"
import { homepageHeroImageUrl } from "@/lib/cloudinary-url"
import type { HeroSlide } from "@/lib/validators/forms"

const DEFAULT_IMAGE = "/karandi-shawl-back.jpg"
const DEFAULT_LINE1 = "Premium Pakistani Women's Clothing"
const DEFAULT_LINE2 =
  "Discover thoughtfully designed embroidered suits, kurtas and seasonal collections created for timeless everyday elegance."
const DEFAULT_BUTTON_TEXT = "Shop New Arrivals"
const DEFAULT_BUTTON_HREF = "/new-arrivals"
const AUTOPLAY_MS = 5500

export interface HeroCarouselProps {
  slides: HeroSlide[]
}

function resolved(raw: string, fallback: string): string {
  const t = raw.trim()
  return t === "" ? fallback : t
}

export function HeroCarousel({ slides }: HeroCarouselProps): React.ReactElement {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const safeSlides = slides.length > 0 ? slides : [{ ...emptySlide() }]

  React.useEffect(() => {
    if (!api) return
    const onSelect = (): void => setCurrent(api.selectedScrollSnap())
    onSelect()
    api.on("select", onSelect)
    return () => {
      api.off("select", onSelect)
    }
  }, [api])

  React.useEffect(() => {
    if (!api || safeSlides.length <= 1) return
    const id = window.setInterval(() => {
      api.scrollNext()
    }, AUTOPLAY_MS)
    return () => window.clearInterval(id)
  }, [api, safeSlides.length])

  return (
    <Carousel
      opts={{ loop: true }}
      setApi={setApi}
      className="relative w-full"
    >
      <CarouselContent className="ml-0">
        {safeSlides.map((slide, index) => {
          const imageSrc = homepageHeroImageUrl(
            resolved(slide.imageUrl, DEFAULT_IMAGE),
          )
          const line1 = resolved(slide.line1, DEFAULT_LINE1)
          const line2 = resolved(slide.line2, DEFAULT_LINE2)
          const buttonText = resolved(slide.buttonText, DEFAULT_BUTTON_TEXT)
          const buttonHref = resolved(slide.buttonHref, DEFAULT_BUTTON_HREF)

          return (
            <CarouselItem key={index} className="pl-0 basis-full">
              <section className="relative w-full min-h-[70vh] md:min-h-[85vh] overflow-hidden">
                <ProductImage
                  src={imageSrc}
                  alt=""
                  fill
                  priority={index === 0}
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
                        {line1}
                      </h1>
                      <p className="text-white/90 text-base md:text-lg leading-relaxed drop-shadow-sm">
                        {line2}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 pt-2 md:pt-4">
                      <Button
                        size="lg"
                        asChild
                        className="uppercase tracking-wider text-sm md:text-base px-6 md:px-8 py-5 md:py-6 bg-black text-white hover:bg-black/90"
                      >
                        <Link href={buttonHref}>{buttonText}</Link>
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
            </CarouselItem>
          )
        })}
      </CarouselContent>

      {safeSlides.length > 1 ? (
        <>
          <CarouselPrevious className="left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 border-white/40 bg-black/40 text-white hover:bg-black/60 hover:text-white disabled:opacity-40" />
          <CarouselNext className="right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 border-white/40 bg-black/40 text-white hover:bg-black/60 hover:text-white disabled:opacity-40" />
          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {safeSlides.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                className={cn(
                  "h-2 w-2 rounded-full transition-colors",
                  index === current ? "bg-white" : "bg-white/50 hover:bg-white/80",
                )}
                onClick={() => api?.scrollTo(index)}
              />
            ))}
          </div>
        </>
      ) : null}
    </Carousel>
  )
}

function emptySlide(): HeroSlide {
  return {
    imageUrl: "",
    line1: "",
    line2: "",
    buttonText: "",
    buttonHref: "",
  }
}
