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
      },
    })
    return settings
  } catch {
    return null
  }
}


