import { prisma } from "@/lib/prisma"

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
      },
    })
    return settings
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

