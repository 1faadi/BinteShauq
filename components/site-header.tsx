"use client"

import Link from "next/link"
import type React from "react"
import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { Button } from "./ui/button"
import { UserMenu } from "./user-menu"
import { useCart } from "@/lib/cart-context"
import { ShoppingCart, Menu, Search, User } from "lucide-react"
import { Logo, LogoMark, Wordmark } from "./logo"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { SidebarHeaderTrigger } from "./sidebar-header-trigger"
import { SHOP_NAV_GROUPS } from "@/lib/shop-nav"

const navLinkClass =
  "px-3 py-2 text-xs font-medium tracking-wide uppercase hover:text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring whitespace-nowrap"

export function SiteHeader(): React.ReactElement {
  const { data: session, status } = useSession()
  const { getTotalItems } = useCart()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const cartCount = getTotalItems()

  const handleSignOut = async (): Promise<void> => {
    setIsMobileMenuOpen(false)
    await signOut({ redirect: false })
    window.location.assign("/")
  }

  const closeMobile = (): void => setIsMobileMenuOpen(false)

  return (
    <header
      className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      dir="ltr"
    >
      {/* Full-width: Browse left edge, utilities right edge, brand+nav centered */}
      <div className="flex w-full items-center gap-2 px-4 py-3 sm:gap-3 sm:px-6 lg:px-8">
        <div className="flex shrink-0 justify-start">
          <SidebarHeaderTrigger />
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-center gap-4 sm:gap-6 lg:gap-10">
          <Link href="/" className="flex min-w-0 flex-shrink items-center gap-2 sm:gap-3">
            <LogoMark size={32} />
            <Wordmark className="hidden truncate min-[420px]:inline" />
          </Link>
          <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
            <Link href="/new-arrivals" className={navLinkClass}>
              New Arrivals
            </Link>
            <Link href="/shop" className={navLinkClass}>
              Shop
            </Link>
            <Link href="/collections/blossom" className={navLinkClass}>
              Collections
            </Link>
            <Link href="/collections/stitched" className={navLinkClass}>
              Stitched
            </Link>
            <Link href="/collections/karandi-shawl-suits" className={navLinkClass}>
              Shawls
            </Link>
            <Link href="/about" className={navLinkClass}>
              About
            </Link>
          </nav>
        </div>

        <div className="flex shrink-0 justify-end items-center gap-1 md:gap-2">
          <Button variant="ghost" size="icon" asChild className="min-h-11 min-w-11">
            <Link href="/shop" aria-label="Search products">
              <Search className="h-5 w-5" />
            </Link>
          </Button>

          <Link
            href="/cart"
            className="relative inline-flex min-h-11 min-w-11 items-center justify-center rounded-md hover:bg-muted transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            aria-label={cartCount > 0 ? `Cart, ${cartCount} items` : "Cart, empty"}
          >
            <ShoppingCart className="h-5 w-5" aria-hidden />
            {cartCount > 0 ? (
              <span className="absolute top-1 right-1 h-4 min-w-4 px-0.5 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center">
                {cartCount}
              </span>
            ) : null}
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {status === "loading" ? (
              <div className="h-8 w-20 animate-pulse bg-muted rounded" />
            ) : session?.user ? (
              <UserMenu user={session.user} />
            ) : (
              <Button variant="ghost" size="sm" asChild className="min-h-11">
                <Link href="/auth/signin" aria-label="Account sign in">
                  <User className="h-4 w-4 mr-1" aria-hidden />
                  Account
                </Link>
              </Button>
            )}
          </div>

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden min-h-11 min-w-11" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-6 mt-6">
                <Logo size={40} showFounder />
                <nav className="flex flex-col gap-3" aria-label="Mobile">
                  <Link href="/new-arrivals" className="text-sm font-medium" onClick={closeMobile}>
                    New Arrivals
                  </Link>
                  <Link href="/shop" className="text-sm font-medium" onClick={closeMobile}>
                    Shop
                  </Link>
                  <Link href="/collections/stitched" className="text-sm font-medium" onClick={closeMobile}>
                    Stitched
                  </Link>
                  <Link href="/collections/karandi-shawl-suits" className="text-sm font-medium" onClick={closeMobile}>
                    Shawls
                  </Link>
                  <Link href="/about" className="text-sm font-medium" onClick={closeMobile}>
                    About
                  </Link>
                  <Link href="/contact" className="text-sm font-medium" onClick={closeMobile}>
                    Contact
                  </Link>
                  <Link href="/size-guide" className="text-sm font-medium" onClick={closeMobile}>
                    Size guide
                  </Link>
                  <div className="border-t pt-3 space-y-3">
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Collections</p>
                    {SHOP_NAV_GROUPS.map((group) => (
                      <div key={group.heading} className="space-y-1">
                        <p className="text-[11px] text-muted-foreground">{group.heading}</p>
                        {group.links.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="block text-sm py-1"
                            onClick={closeMobile}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                </nav>
                <div className="flex flex-col gap-2 border-t pt-4">
                  {session?.user ? (
                    <>
                      <Button variant="outline" asChild>
                        <Link href="/account" onClick={closeMobile}>
                          My Account
                        </Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href="/orders" onClick={closeMobile}>
                          My Orders
                        </Link>
                      </Button>
                      <Button variant="destructive" onClick={() => void handleSignOut()}>
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button asChild>
                        <Link href="/auth/signin" onClick={closeMobile}>
                          Sign In
                        </Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href="/auth/signup" onClick={closeMobile}>
                          Create Account
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
