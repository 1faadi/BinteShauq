export const SITE_URL = "https://www.binteshauq.store"
export const BRAND_NAME = "Bint-e-Shauq"
export const FOUNDER_NAME = "Sadia Ismail"
export const DEFAULT_CURRENCY = "PKR"

export const DEFAULT_META = {
  title: `${BRAND_NAME} | Premium Pakistani Women's Clothing`,
  description:
    "Discover thoughtfully designed embroidered suits, kurtas and seasonal collections created for timeless everyday elegance.",
} as const

export function absoluteUrl(path: string): string {
  const base = SITE_URL.replace(/\/$/, "")
  if (!path || path === "/") return base
  return `${base}${path.startsWith("/") ? path : `/${path}`}`
}
