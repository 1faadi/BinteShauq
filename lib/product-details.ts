import type { Product } from "@/lib/data"

export type DupattaShawlKind = "dupatta" | "shawl"

export type ProductDetailRow = {
  label: string
  value: string
}

export function resolveDupattaShawlKind(
  product: Pick<Product, "dupattaShawlKind" | "usage">
): DupattaShawlKind | undefined {
  const kind = product.dupattaShawlKind?.toLowerCase()
  if (kind === "dupatta" || kind === "shawl") {
    return kind
  }
  const usage = product.usage?.toLowerCase() ?? ""
  if (usage.includes("dupatta")) return "dupatta"
  if (usage.includes("shawl")) return "shawl"
  return undefined
}

export function getDetailsCustomText(
  product: Pick<Product, "detailsCustom">
): string | undefined {
  const text = product.detailsCustom?.trim()
  return text && text.length > 0 ? text : undefined
}

/** Rows for the product details table (fixed order; omits empty values). */
export function buildProductDetailRows(
  product: Product
): ProductDetailRow[] {
  const rows: ProductDetailRow[] = []

  const fabric = product.fabric?.trim()
  if (fabric) {
    rows.push({ label: "Fabric", value: fabric })
  }

  const dupattaKind = resolveDupattaShawlKind(product)
  const dupattaDetail =
    product.dupattaShawlDetail?.trim() ||
    product.shawlLength?.trim() ||
    product.usage?.trim()
  if (dupattaDetail) {
    const label =
      dupattaKind === "dupatta"
        ? "Dupatta"
        : dupattaKind === "shawl"
          ? "Shawl"
          : "Dupatta / Shawl"
    rows.push({ label, value: dupattaDetail })
  }

  const trousers = product.trousers?.trim() || product.suitFabric?.trim()
  if (trousers) {
    rows.push({ label: "Trousers", value: trousers })
  }

  const embellishment =
    product.embellishment?.trim() || product.embroidery?.trim()
  if (embellishment) {
    rows.push({ label: "Embellishment", value: embellishment })
  }

  const care = product.care?.trim()
  if (care) {
    rows.push({ label: "Care", value: care })
  }

  return rows
}

export function hasProductDetailsContent(product: Product): boolean {
  return (
    getDetailsCustomText(product) !== undefined ||
    buildProductDetailRows(product).length > 0
  )
}
