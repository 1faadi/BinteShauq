import { absoluteUrl, BRAND_NAME, SITE_URL } from "@/lib/site"

export function organizationJsonLd(opts?: {
  email?: string | null
  phone?: string | null
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/PHOTO-2025-10-02-00-42-10.jpg"),
    email: opts?.email ?? undefined,
    telephone: opts?.phone ?? undefined,
  }
}

export function websiteJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BRAND_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/shop?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function productJsonLd(product: {
  name: string
  description: string
  slug: string
  images: string[]
  price: number
  inStock: boolean
  sku?: string
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    sku: product.sku ?? product.slug,
    brand: { "@type": "Brand", name: BRAND_NAME },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/products/${product.slug}`),
      priceCurrency: "PKR",
      price: product.price,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  }
}

export function itemListJsonLd(
  items: { name: string; path: string; position: number }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item) => ({
      "@type": "ListItem",
      position: item.position,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  }
}

export function faqJsonLd(
  faqs: { question: string; answer: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}
