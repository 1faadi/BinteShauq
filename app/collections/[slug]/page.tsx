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
import { Button } from "@/components/ui/button"
import { PageLoader } from "@/components/ui/page-loader"
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

const COLLECTION_COPY: Record<string, { title: string; intro: string }> = {
  "karandi-shawl-suits": {
    title: "Karandi Shawl Suits",
    intro:
      "Winter-ready karandi shawl ensembles designed for warmth, structure, and everyday elegance.",
  },
  blossom: {
    title: "Blossom",
    intro: "Soft florals and light embroideries for a fresh, graceful silhouette.",
  },
  linear: {
    title: "Linear",
    intro: "Clean lines and refined detailing for a modern, polished look.",
  },
  flora: {
    title: "Flora",
    intro: "Botanical motifs and textured finishes for season-spanning wear.",
  },
  stitched: {
    title: "Stitched",
    intro: "Ready-to-wear stitched pieces with thoughtful sizing and finish.",
  },
}

type CollectionSearchParams = {
  sort?: string
  color?: string
  fabric?: string
  availability?: string
  page?: string
}

function formatCollectionName(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

function getCollectionMeta(slug: string): { title: string; intro: string } {
  return (
    COLLECTION_COPY[slug] ?? {
      title: formatCollectionName(slug),
      intro: `Explore the ${formatCollectionName(slug)} collection from ${BRAND_NAME}.`,
    }
  )
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams?: Promise<CollectionSearchParams>
}): Promise<Metadata> {
  const { slug } = await params
  const sp = searchParams ? await searchParams : {}
  const meta = getCollectionMeta(slug)
  const hasFilters = Boolean(
    sp.color ||
      sp.fabric ||
      sp.availability ||
      sp.page ||
      (sp.sort && sp.sort !== "featured")
  )
  return buildPageMetadata({
    title: `${meta.title} Collection | ${BRAND_NAME}`,
    description: meta.intro,
    path: `/collections/${slug}`,
    noIndex: hasFilters,
  })
}

function buildFilterHref(
  slug: string,
  current: CollectionSearchParams,
  patch: Partial<CollectionSearchParams>
): string {
  const next = { ...current, ...patch }
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(next)) {
    if (value && value.length > 0) params.set(key, value)
  }
  if (!("page" in patch)) params.delete("page")
  const qs = params.toString()
  return qs ? `/collections/${slug}?${qs}` : `/collections/${slug}`
}

async function CollectionContent({
  slug,
  sp,
}: {
  slug: string
  sp: CollectionSearchParams
}): Promise<React.ReactElement> {
  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1)
  const meta = getCollectionMeta(slug)
  const availability =
    sp.availability === "all" || sp.availability === "out-of-stock"
      ? sp.availability
      : "in-stock"

  const [{ items, total }, filters] = await Promise.all([
    getProducts({
      sort: sp.sort || "featured",
      collection: slug,
      color: sp.color,
      fabric: sp.fabric,
      availability,
      page,
      pageSize: PAGE_SIZE,
    }),
    getProductFilterOptions(slug),
  ])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: meta.title, path: `/collections/${slug}` },
  ])
  const itemList = itemListJsonLd(
    items.map((p, i) => ({
      name: p.name,
      path: `/products/${p.slug}`,
      position: (page - 1) * PAGE_SIZE + i + 1,
    }))
  )

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
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
            <BreadcrumbLink asChild>
              <Link href="/shop">Shop</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{meta.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">{meta.title} Collection</h1>
          <p className="text-muted-foreground max-w-2xl">{meta.intro}</p>
          <p className="text-sm text-muted-foreground mt-2">
            {total} {total === 1 ? "product" : "products"}
          </p>
        </div>
        <Suspense fallback={null}>
          <SortDropdown />
        </Suspense>
      </div>

      <form method="get" className="mb-8 flex flex-wrap gap-3">
        {sp.sort ? <input type="hidden" name="sort" value={sp.sort} /> : null}
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
        <Button type="submit" size="sm">
          Apply
        </Button>
      </form>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No products found in this collection.</p>
          <Link href="/shop" className="text-primary hover:underline">
            Browse all products
          </Link>
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
              <Link href={buildFilterHref(slug, sp, { page: String(page - 1) })}>
                Previous
              </Link>
            </Button>
          ) : null}
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          {page < totalPages ? (
            <Button asChild variant="outline" size="sm">
              <Link href={buildFilterHref(slug, sp, { page: String(page + 1) })}>Next</Link>
            </Button>
          ) : null}
        </nav>
      ) : null}
    </div>
  )
}

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams?: Promise<CollectionSearchParams>
}): Promise<React.ReactElement> {
  const { slug } = await params
  const sp = searchParams ? await searchParams : {}
  const key = [slug, sp.sort, sp.color, sp.fabric, sp.availability, sp.page].join("|")

  return (
    <Suspense key={key} fallback={<PageLoader label="Loading collection" fullScreen />}>
      <CollectionContent slug={slug} sp={sp} />
    </Suspense>
  )
}
