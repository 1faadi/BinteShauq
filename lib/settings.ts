import { prisma } from "@/lib/prisma"
import { parseHeroSlides, type HeroSlide } from "@/lib/validators/forms"

const DEFAULT_DELIVERY_CHARGE_PKR = 300

export type { HeroSlide }
export { parseHeroSlides }

export type HeroSlidesResult = {
  slides: HeroSlide[]
  heroFontFamily1: string | null
  heroFontFamily2: string | null
  heroFontSize1: string | null
  heroFontSize2: string | null
  heroFontWeight1: string | null
  heroFontWeight2: string | null
}

/** Effective nationwide delivery fee in PKR (0 when fees are disabled). */
export async function getDeliveryChargePkr(): Promise<number> {
  try {
    const row = await prisma.storeSettings.findFirst({
      select: { deliveryChargePkr: true, deliveryChargeEnabled: true },
    })
    if (row?.deliveryChargeEnabled === false) {
      return 0
    }
    const n = row?.deliveryChargePkr
    if (typeof n !== "number" || !Number.isFinite(n) || n < 0) {
      return DEFAULT_DELIVERY_CHARGE_PKR
    }
    return Math.floor(n)
  } catch {
    return DEFAULT_DELIVERY_CHARGE_PKR
  }
}

export async function getStoreSettings() {
  try {
    const settings = await prisma.storeSettings.findFirst()
    return settings
  } catch {
    return null
  }
}

/** Public hero settings for home page (no auth required) */
export async function getHeroSettings() {
  try {
    const settings = await prisma.storeSettings.findFirst({
      select: {
        heroLine1: true,
        heroLine2: true,
        heroFontFamily1: true,
        heroFontFamily2: true,
        heroFontSize1: true,
        heroFontSize2: true,
        heroFontWeight1: true,
        heroFontWeight2: true,
        heroImageUrl: true,
        heroButtonText: true,
        heroButtonHref: true,
        heroSlides: true,
      },
    })
    return settings
  } catch {
    return null
  }
}

/** Public multi-slide hero for home page (falls back to legacy single-hero fields). */
export async function getHeroSlides(): Promise<HeroSlidesResult | null> {
  try {
    const settings = await prisma.storeSettings.findFirst({
      select: {
        heroSlides: true,
        heroLine1: true,
        heroLine2: true,
        heroFontFamily1: true,
        heroFontFamily2: true,
        heroFontSize1: true,
        heroFontSize2: true,
        heroFontWeight1: true,
        heroFontWeight2: true,
        heroImageUrl: true,
        heroButtonText: true,
        heroButtonHref: true,
      },
    })
    if (!settings) return null

    return {
      slides: parseHeroSlides(settings.heroSlides, settings),
      heroFontFamily1: settings.heroFontFamily1,
      heroFontFamily2: settings.heroFontFamily2,
      heroFontSize1: settings.heroFontSize1,
      heroFontSize2: settings.heroFontSize2,
      heroFontWeight1: settings.heroFontWeight1,
      heroFontWeight2: settings.heroFontWeight2,
    }
  } catch {
    return null
  }
}

const HOME_ABOUT_SELECT = {
  homeAboutTitle: true,
  homeAboutParagraph1: true,
  homeAboutParagraph2: true,
  homeAboutButtonText: true,
  homeAboutButtonHref: true,
  homeAboutImageUrl: true,
  homeAboutImageAlt: true,
} as const

export type HomeAboutSectionSettings = {
  homeAboutTitle: string | null
  homeAboutParagraph1: string | null
  homeAboutParagraph2: string | null
  homeAboutButtonText: string | null
  homeAboutButtonHref: string | null
  homeAboutImageUrl: string | null
  homeAboutImageAlt: string | null
}

/** Public home “About collection” section (no auth) */
export async function getHomeAboutSectionSettings(): Promise<HomeAboutSectionSettings | null> {
  try {
    const row = await prisma.storeSettings.findFirst({
      select: HOME_ABOUT_SELECT,
    })
    return row
  } catch {
    return null
  }
}

