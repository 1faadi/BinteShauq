import type { MetadataRoute } from "next"
import { prisma } from "@/lib/prisma"
import { SITE_URL } from "@/lib/site"
import { SHOP_NAV_GROUPS } from "@/lib/shop-nav"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/shop",
    "/new-arrivals",
    "/about",
    "/contact",
    "/faq",
    "/policies",
    "/size-guide",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }))

  const collectionPaths = SHOP_NAV_GROUPS.flatMap((g) => g.links.map((l) => l.href))
  const collections: MetadataRoute.Sitemap = collectionPaths.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  let products: MetadataRoute.Sitemap = []
  try {
    const rows = await prisma.product.findMany({
      where: { inStock: true },
      select: { slug: true, updatedAt: true },
    })
    products = rows.map((p) => ({
      url: `${SITE_URL}/products/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }))
  } catch {
    products = []
  }

  return [...staticRoutes, ...collections, ...products]
}
