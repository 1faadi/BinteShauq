import { unstable_cache } from "next/cache"
import { prisma } from "@/lib/prisma"

export const MAINTENANCE_CACHE_TAG = "maintenance-mode"

const ALLOWED_PREFIXES = [
  "/admin",
  "/api/auth",
  "/api/admin",
  "/api/upload",
  "/api/store/maintenance",
  "/maintenance",
  "/_next",
] as const

const ALLOWED_EXACT = new Set([
  "/auth/signin",
  "/favicon.ico",
  "/favicon.png",
  "/apple-icon.png",
  "/robots.txt",
  "/sitemap.xml",
  "/llms.txt",
  "/manifest.webmanifest",
])

/** Paths that stay reachable while the store is in maintenance. */
export function isMaintenanceBypassPath(pathname: string): boolean {
  if (ALLOWED_EXACT.has(pathname)) return true
  return ALLOWED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
}

async function readMaintenanceMode(): Promise<boolean> {
  try {
    const row = await prisma.storeSettings.findFirst({
      select: { maintenanceMode: true },
    })
    return row?.maintenanceMode === true
  } catch {
    return false
  }
}

export const getMaintenanceMode = unstable_cache(
  readMaintenanceMode,
  ["maintenance-mode"],
  { revalidate: 5, tags: [MAINTENANCE_CACHE_TAG] }
)
