"use client"

import Link from "next/link"
import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { MegaMenu } from "./mega-menu"
import { SortDropdown } from "./sort-dropdown"
import { Button } from "./ui/button"
import { UserMenu } from "./user-menu"
import { useCart } from "@/lib/cart-context"
import { ShoppingCart, Menu, X } from "lucide-react"
import { Logo } from "./logo"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"

export function SiteHeader() {
  const { data: session, status } = useSession()
  const { getTotalItems } = useCart()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Logo size={32} />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-2">
          <Link href="/" className="px-4 py-2 caps text-xs hover:text-primary transition-colors">
            Home
          </Link>
          <MegaMenu />
          <Link href="/new-arrivals" className="px-4 py-2 caps text-xs hover:text-primary transition-colors">
            New Arrivals
          </Link>
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Desktop Sort Dropdown */}
          <div className="hidden md:block">
            <SortDropdown />
          </div>

          {/* Cart */}
          <Link href="/cart" className="relative p-2 hover:bg-muted rounded-md transition-colors">
            <ShoppingCart className="h-5 w-5" />
            {getTotalItems() > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </Link>

          {/* Desktop Auth */}
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

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-6 mt-6">
                {/* Mobile Logo */}
                <div className="flex justify-center">
                  <Logo size={40} />
                </div>

                {/* Mobile Navigation */}
                <nav className="flex flex-col space-y-4">
                  <Link 
                    href="/" 
                    className="text-lg font-medium hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link 
                    href="/shop" 
                    className="text-lg font-medium hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Shop
                  </Link>
                  <Link 
                    href="/new-arrivals" 
                    className="text-lg font-medium hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    New Arrivals
                  </Link>
                  <Link 
                    href="/collections/blossom" 
                    className="text-lg font-medium hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Collections
                  </Link>
                </nav>

                {/* Mobile Sort */}
                <div className="md:hidden">
                  <SortDropdown />
                </div>

                {/* Mobile Auth */}
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
                            signOut()
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
