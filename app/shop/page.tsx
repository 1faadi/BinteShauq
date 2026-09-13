import Link from "next/link"
import type { Metadata } from "next"
import { Suspense } from "react"
import {
  getProducts,
  getProductFilterOptions,
  getProductImage,
  getProductImages,
} from "@/lib/data"
import { ProductCard } from "@/components/product-card"
import { SortDropdown } from "@/components/sort-dropdown"
import { PageLoader } from "@/components/ui/page-loader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { buildPageMetadata, jsonLdScript } from "@/lib/seo/metadata"
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo/json-ld"
import { BRAND_NAME } from "@/lib/site"

export const dynamic = "force-dynamic"

const PAGE_SIZE = 24

type ShopSearchParams = {
  sort?: string
  q?: string
  collection?: string
  color?: string
  fabric?: string
  availability?: string
  page?: string
}

function hasFilterQuery(sp: ShopSearchParams): boolean {
  return Boolean(
    sp.q ||
      sp.collection ||
      sp.color ||
      sp.fabric ||
      sp.availability ||
      sp.page ||
      (sp.sort && sp.sort !== "featured")
  )
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<ShopSearchParams>
}): Promise<Metadata> {
  const sp = searchParams ? await searchParams : {}
  return buildPageMetadata({
    title: `Shop | ${BRAND_NAME}`,
    description:
      "Browse Bint-e-Shauq embroidered suits, kurtas, and seasonal collections. Filter by color, fabric, and availability.",
    path: "/shop",
    noIndex: hasFilterQuery(sp),
  })
}

function buildFilterHref(
  current: ShopSearchParams,
  patch: Partial<ShopSearchParams>
): string {
  const next = { ...current, ...patch }
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(next)) {
    if (value && value.length > 0) params.set(key, value)
  }
  // Reset page when filters change (unless patch sets page)
  if (!("page" in patch)) {
    params.delete("page")
  }
  const qs = params.toString()
  return qs ? `/shop?${qs}` : "/shop"
}

async function ShopContent({ sp }: { sp: ShopSearchParams }) {
  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1)
  const availability =
    sp.availability === "all" || sp.availability === "out-of-stock"
      ? sp.availability
      : sp.availability === "in-stock"
        ? "in-stock"
        : "in-stock"

  const [{ items, total }, filters] = await Promise.all([
    getProducts({
      sort: sp.sort || "featured",
      q: sp.q,
      collection: sp.collection,
      color: sp.color,
      fabric: sp.fabric,
      availability,
      page,
      pageSize: PAGE_SIZE,
    }),
    getProductFilterOptions(),
  ])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
  ])
  const itemList = itemListJsonLd(
    items.map((p, i) => ({
      name: p.name,
      path: `/products/${p.slug}`,
      position: (page - 1) * PAGE_SIZE + i + 1,
    }))
  )

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript([breadcrumb, itemList]) }}
      />

      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Shop</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-6 md:mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Shop</h1>
          <p className="text-muted-foreground">
            Discover embroidered suits, kurtas, and seasonal collections
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {total} {total === 1 ? "product" : "products"}
            {sp.q ? ` matching “${sp.q}”` : ""}
          </p>
        </div>
        <Suspense fallback={null}>
          <SortDropdown />
        </Suspense>
      </div>

      <form method="get" className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {sp.sort ? <input type="hidden" name="sort" value={sp.sort} /> : null}
        <Input
          name="q"
          placeholder="Search…"
          defaultValue={sp.q ?? ""}
          aria-label="Search products"
          className="lg:col-span-2"
        />
        <select
          name="collection"
          defaultValue={sp.collection ?? ""}
          aria-label="Collection"
          className="h-9 rounded-md border bg-background px-3 text-sm"
        >
          <option value="">All collections</option>
          {filters.collections.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          name="color"
          defaultValue={sp.color ?? ""}
          aria-label="Color"
          className="h-9 rounded-md border bg-background px-3 text-sm"
        >
          <option value="">All colors</option>
          {filters.colors.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          name="fabric"
          defaultValue={sp.fabric ?? ""}
          aria-label="Fabric"
          className="h-9 rounded-md border bg-background px-3 text-sm"
        >
          <option value="">All fabrics</option>
          {filters.fabrics.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
        <select
          name="availability"
          defaultValue={sp.availability ?? "in-stock"}
          aria-label="Availability"
          className="h-9 rounded-md border bg-background px-3 text-sm"
        >
          <option value="in-stock">In stock</option>
          <option value="out-of-stock">Out of stock</option>
          <option value="all">All</option>
        </select>
        <Button type="submit" className="sm:col-span-2 lg:col-span-6 w-full sm:w-auto">
          Apply filters
        </Button>
      </form>

      {items.length === 0 ? (
        <div className="text-center py-16 border rounded-lg">
          <p className="text-muted-foreground mb-4">No products match your filters.</p>
          <Button asChild variant="outline">
            <Link href="/shop">Clear filters</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {items.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              slug={p.slug}
              name={p.name}
              price={p.price}
              compareAtPrice={p.compareAtPrice}
              image={getProductImage(p)}
              images={getProductImages(p)}
            />
          ))}
        </div>
      )}

      {totalPages > 1 ? (
        <nav className="mt-10 flex items-center justify-center gap-3" aria-label="Pagination">
          {page > 1 ? (
            <Button asChild variant="outline" size="sm">
              <Link href={buildFilterHref(sp, { page: String(page - 1) })}>Previous</Link>
            </Button>
          ) : null}
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          {page < totalPages ? (
            <Button asChild variant="outline" size="sm">
              <Link href={buildFilterHref(sp, { page: String(page + 1) })}>Next</Link>
            </Button>
          ) : null}
        </nav>
      ) : null}
    </div>
  )
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams?: Promise<ShopSearchParams>
}): Promise<React.ReactElement> {
  const sp = searchParams ? await searchParams : {}
  const suspenseKey = [
    sp.sort,
    sp.q,
    sp.collection,
    sp.color,
    sp.fabric,
    sp.availability,
    sp.page,
  ].join("|")

  return (
    <Suspense key={suspenseKey} fallback={<PageLoader label="Loading shop" fullScreen />}>
      <ShopContent sp={sp} />
    </Suspense>
  )
}
