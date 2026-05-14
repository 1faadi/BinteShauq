import type { PrismaClient } from "@prisma/client"

function slugifyName(name: string): string {
  const s = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
  return s.length > 0 ? s : "product"
}

/**
 * Returns a `slug` that is unique in `Product.slug`.
 * When updating, pass `excludeProductId` so the current row does not count as a conflict.
 */
export async function allocateUniqueProductSlug(
  prisma: PrismaClient,
  name: string,
  excludeProductId?: string
): Promise<string> {
  const baseSlug = slugifyName(name)
  let slug = baseSlug
  let counter = 1
  for (;;) {
    const conflict = await prisma.product.findFirst({
      where: {
        slug,
        ...(excludeProductId ? { NOT: { id: excludeProductId } } : {}),
      },
    })
    if (!conflict) {
      return slug
    }
    slug = `${baseSlug}-${counter}`
    counter += 1
  }
}
