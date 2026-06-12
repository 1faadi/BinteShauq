import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Playfair_Display, Lora, Inter, Montserrat } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { SiteChrome } from "@/components/site-chrome"
import { Suspense } from "react"
import { SessionProvider } from "@/components/session-provider"
import { CartProvider } from "@/lib/cart-context"
import { Toaster } from "@/components/ui/sonner"
import { MetaPixel } from "@/components/meta-pixel"
import { TopProgressBar } from "@/components/top-progress-bar"

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" })
const lora = Lora({ subsets: ["latin"], variable: "--font-lora", display: "swap" })
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" })
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", display: "swap" })

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
      <head>
        <link
          rel="preconnect"
          href="https://res.cloudinary.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} ${playfair.variable} ${lora.variable} ${inter.variable} ${montserrat.variable}`}>
        <TopProgressBar />
        <SessionProvider>
          <CartProvider>
            <Suspense fallback={null}>
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
