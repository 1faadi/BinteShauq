import { prisma } from "@/lib/prisma"

export async function getStoreSettings() {
  try {
    const settings = await prisma.storeSettings.findFirst()
    return settings
  } catch {
    return null
  }
}


