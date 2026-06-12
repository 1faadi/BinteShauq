"use client"

import Link from "next/link"
import type React from "react"
import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { SortDropdown } from "./sort-dropdown"
import { Button } from "./ui/button"
import { UserMenu } from "./user-menu"
import { useCart } from "@/lib/cart-context"
import { ShoppingCart, Menu } from "lucide-react"
import { Logo, LogoMark, Wordmark } from "./logo"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { SidebarHeaderTrigger } from "./sidebar-header-trigger"
import { SHOP_NAV_GROUPS } from "@/lib/shop-nav"

const navLinkClass =
  "px-4 py-2 caps text-xs hover:text-primary transition-colors whitespace-nowrap"

export function SiteHeader(): React.ReactElement {
  const { data: session, status } = useSession()
  const { getTotalItems } = useCart()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header
      className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      dir="ltr"
    >
      {/* Full-width row so Browse sits at the viewport edge, not inside a centered max-width box */}
      <div className="flex w-full items-center gap-2 px-4 py-3 sm:gap-3 sm:px-6 lg:px-8">
        <div className="flex shrink-0 justify-start">
          <SidebarHeaderTrigger />
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-center gap-4 sm:gap-6 lg:gap-10">
          <Link href="/" className="flex min-w-0 flex-shrink items-center gap-2 sm:gap-3">
            <LogoMark size={32} />
            <Wordmark className="hidden truncate min-[420px]:inline" />
          </Link>
          <nav className="hidden lg:flex items-center gap-1">
            <Link href="/" className={navLinkClass}>
              Home
            </Link>
            <Link href="/new-arrivals" className={navLinkClass}>
              New Arrivals
            </Link>
            <Link href="/about" className={navLinkClass}>
              About
            </Link>
            <Link href="/contact" className={navLinkClass}>
              Contact Us
            </Link>
          </nav>
        </div>

        <div className="flex shrink-0 justify-end items-center gap-2 md:gap-4">
          <div className="hidden md:block">
            <SortDropdown />
          </div>

          <Link href="/cart" className="relative p-2 hover:bg-muted rounded-md transition-colors">
            <ShoppingCart className="h-5 w-5" />
            {getTotalItems() > 0 ? (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
                {getTotalItems()}
              </span>
            ) : null}
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {status === "loading" ? (
              <div className="h-8 w-20 animate-pulse bg-muted rounded" />
            ) : session && session.user ? (
              <UserMenu user={session.user} />
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-6 mt-6">
                <div className="flex justify-center">
                  <Logo size={40} />
                </div>

                <nav className="flex flex-col space-y-4">
                  <Link
                    href="/"
                    className="text-lg font-medium hover:text-primary transition-colors caps text-sm tracking-wide"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    href="/new-arrivals"
                    className="text-lg font-medium hover:text-primary transition-colors caps text-sm tracking-wide"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    New Arrivals
                  </Link>
                  <Link
                    href="/about"
                    className="text-lg font-medium hover:text-primary transition-colors caps text-sm tracking-wide"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link
                    href="/contact"
                    className="text-lg font-medium hover:text-primary transition-colors caps text-sm tracking-wide"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Contact Us
                  </Link>

                  <div className="border-t border-border pt-4 space-y-3">
                    <p className="caps-tight text-[11px] text-muted-foreground">Browse categories</p>
                    <Link
                      href="/shop"
                      className="block text-sm font-medium hover:text-primary transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      All products
                    </Link>
                    <div className="pl-3 space-y-4 border-l border-border">
                      {SHOP_NAV_GROUPS.map((group) => (
                        <div key={group.heading} className="space-y-2">
                          <p className="caps-tight text-[11px] text-muted-foreground">{group.heading}</p>
                          <div className="flex flex-col gap-1">
                            {group.links.map((link) => (
                              <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm hover:text-primary transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                {link.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </nav>

                <div className="md:hidden">
                  <SortDropdown />
                </div>

                <div className="flex flex-col space-y-3">
                  {status === "loading" ? (
                    <div className="h-8 w-full animate-pulse bg-muted rounded" />
                  ) : session ? (
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground">
                        Welcome, {session.user?.name || session.user?.email}
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Button variant="outline" asChild className="w-full">
                          <Link href="/account" onClick={() => setIsMobileMenuOpen(false)}>
                            My Account
                          </Link>
                        </Button>
                        <Button variant="outline" asChild className="w-full">
                          <Link href="/orders" onClick={() => setIsMobileMenuOpen(false)}>
                            My Orders
                          </Link>
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            void signOut()
                            setIsMobileMenuOpen(false)
                          }}
                          className="w-full"
                        >
                          Sign Out
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      <Button asChild className="w-full">
                        <Link href="/auth/signin" onClick={() => setIsMobileMenuOpen(false)}>
                          Sign In
                        </Link>
                      </Button>
                      <Button variant="outline" asChild className="w-full">
                        <Link href="/auth/signup" onClick={() => setIsMobileMenuOpen(false)}>
                          Sign Up
                        </Link>
                      </Button>
                    </div>
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
