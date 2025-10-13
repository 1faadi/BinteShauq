import Link from "next/link"
import { LogoMark, Wordmark } from "./logo"

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div className="space-y-2">
            <div className="caps-tight text-[12px]">Customer Care</div>
            <Link href="/orders" className="block hover:opacity-70">
              Order Tracking
            </Link>
            <Link href="/policies" className="block hover:opacity-70">
              Policies
            </Link>
            <Link href="/faq" className="block hover:opacity-70">
              FAQ's
            </Link>
          </div>

          <div className="flex flex-col items-center gap-3">
            <LogoMark size={64} />
            <Wordmark />
            <div className="flex items-center gap-4 mt-2">
              <Link href="#" className="text-sm underline-offset-2 hover:underline">
                Facebook
              </Link>
              <Link href="#" className="text-sm underline-offset-2 hover:underline">
                Instagram
              </Link>
              <Link href="#" className="text-sm underline-offset-2 hover:underline">
                WhatsApp
              </Link>
            </div>
          </div>

          <div className="space-y-2 md:items-end md:text-right">
            <div className="caps-tight text-[12px]">Information</div>
            <Link href="/about" className="block hover:opacity-70">
              Our Story
            </Link>
            <div className="block">
              Contact Us <span className="opacity-70">+923711538953</span>
            </div>
            <Link href="#" className="block hover:opacity-70">
              Subscribe Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
