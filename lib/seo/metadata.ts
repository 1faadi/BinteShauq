import type { Metadata } from "next"
import { absoluteUrl, BRAND_NAME, DEFAULT_META, SITE_URL } from "@/lib/site"

export function buildPageMetadata(input: {
  title: string
  description: string
  path: string
  image?: string
  noIndex?: boolean
}): Metadata {
  const url = absoluteUrl(input.path)
  const image = input.image ?? absoluteUrl("/PHOTO-2025-10-02-00-42-10.jpg")

  return {
    metadataBase: new URL(SITE_URL),
    title: input.title,
    description: input.description,
    alternates: { canonical: url },
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      siteName: BRAND_NAME,
      type: "website",
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [image],
    },
    robots: input.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  }
}

export function rootFallbackMetadata(): Metadata {
  return buildPageMetadata({
    title: DEFAULT_META.title,
    description: DEFAULT_META.description,
    path: "/",
  })
}

export function jsonLdScript(data: Record<string, unknown> | Record<string, unknown>[]): string {
  return JSON.stringify(data).replace(/</g, "\\u003c")
}
