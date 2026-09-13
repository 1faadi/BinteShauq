import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Playfair_Display, Lora } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { SiteChrome } from "@/components/site-chrome"
import { Suspense } from "react"
import { SessionProvider } from "@/components/session-provider"
import { CartProvider } from "@/lib/cart-context"
import { Toaster } from "@/components/ui/sonner"
import { MetaPixel } from "@/components/meta-pixel"
import { TopProgressBar } from "@/components/top-progress-bar"
import { AnnouncementBar } from "@/components/announcement-bar"
import { buildPageMetadata } from "@/lib/seo/metadata"
import { BRAND_NAME, DEFAULT_META, SITE_URL } from "@/lib/site"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})
const lora = Lora({ subsets: ["latin"], variable: "--font-lora", display: "swap" })

const LOGO_ICON = "/favicon.png"

export async function generateMetadata(): Promise<Metadata> {
  const icons: Metadata["icons"] = {
    icon: [{ url: LOGO_ICON, type: "image/png" }],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
    shortcut: LOGO_ICON,
  }

  try {
    const { getStoreSettings } = await import("@/lib/settings")
    const s = await getStoreSettings()
    const title = s?.storeName?.trim() || DEFAULT_META.title
    const description = s?.storeDescription?.trim() || DEFAULT_META.description
    return {
      ...buildPageMetadata({
        title: title.includes(BRAND_NAME) ? title : `${title} | ${BRAND_NAME}`,
        description,
        path: "/",
      }),
      metadataBase: new URL(SITE_URL),
      icons,
    }
  } catch {
    return {
      ...buildPageMetadata({
        title: DEFAULT_META.title,
        description: DEFAULT_META.description,
        path: "/",
      }),
      icons,
    }
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>): React.ReactElement {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} ${playfair.variable} ${lora.variable}`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 focus:bg-background focus:px-4 focus:py-2 focus:border"
        >
          Skip to content
        </a>
        <TopProgressBar />
        <SessionProvider>
          <CartProvider>
            <Suspense fallback={null}>
              <AnnouncementBar />
              <SiteChrome>{children}</SiteChrome>
            </Suspense>
            <Toaster />
          </CartProvider>
        </SessionProvider>
        <Analytics />
        <MetaPixel />
      </body>
    </html>
  )
}
