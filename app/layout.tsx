import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { SiteChrome } from "@/components/site-chrome"
import { Suspense } from "react"
import { SessionProvider } from "@/components/session-provider"
import { CartProvider } from "@/lib/cart-context"
import { Toaster } from "@/components/ui/sonner"

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { getStoreSettings } = await import("@/lib/settings")
    const s = await getStoreSettings()
    return {
      title: s?.storeName || "Sadia Ismail — E‑commerce",
      description: "Minimal, editorial storefront for shawls & suits.",
      generator: "v0.app",
    }
  } catch {
    return {
      title: "Sadia Ismail — E‑commerce",
      description: "Minimal, editorial storefront for shawls & suits.",
      generator: "v0.app",
    }
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <SessionProvider>
          <CartProvider>
            <Suspense fallback={null}>
              <SiteChrome>{children}</SiteChrome>
            </Suspense>
            <Toaster />
          </CartProvider>
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  )
}
