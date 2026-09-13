import Link from "next/link"
import { LogoMark, Wordmark } from "./logo"
import { FOUNDER_NAME } from "@/lib/site"
import { NewsletterForm } from "@/components/newsletter-form"

export function SiteFooter(): React.ReactElement {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="space-y-2">
            <div className="text-xs font-medium uppercase tracking-wide">Customer Care</div>
            <Link href="/orders" className="block text-sm hover:underline underline-offset-2">
              Order Tracking
            </Link>
            <Link href="/policies" className="block text-sm hover:underline underline-offset-2">
              Policies
            </Link>
            <Link href="/faq" className="block text-sm hover:underline underline-offset-2">
              FAQ
            </Link>
            <Link href="/size-guide" className="block text-sm hover:underline underline-offset-2">
              Size guide
            </Link>
          </div>

          <div className="flex flex-col items-center gap-2 md:col-span-2">
            <LogoMark size={56} />
            <Wordmark />
            <p className="text-xs text-muted-foreground">Designed by {FOUNDER_NAME}</p>
            <div className="flex items-center gap-4 mt-2">
              <Link
                href="https://www.facebook.com/profile.php?id=61580600636206"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm underline-offset-2 hover:underline"
              >
                Facebook
              </Link>
              <Link
                href="https://www.instagram.com/bint_e_shauq/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm underline-offset-2 hover:underline"
              >
                Instagram
              </Link>
              <Link
                href="https://wa.me/923711538953"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm underline-offset-2 hover:underline"
              >
                WhatsApp
              </Link>
            </div>
            <div className="w-full max-w-md mt-6">
              <p className="text-xs font-medium uppercase tracking-wide mb-2 text-center">Newsletter</p>
              <NewsletterForm compact />
            </div>
          </div>

          <div className="space-y-2 md:text-right">
            <div className="text-xs font-medium uppercase tracking-wide">Information</div>
            <Link href="/about" className="block text-sm hover:underline underline-offset-2">
              Our Story
            </Link>
            <Link href="/contact" className="block text-sm hover:underline underline-offset-2">
              Contact Us
            </Link>
            <a href="tel:+923711538953" className="block text-sm text-muted-foreground">
              +92 371 1538953
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
