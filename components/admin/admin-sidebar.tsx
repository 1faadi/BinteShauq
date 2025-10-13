"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Settings,
  BarChart3,
  FileText,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useSidebar } from "@/lib/sidebar-context"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Reports", href: "/admin/reports", icon: FileText },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isCollapsed, toggleSidebar } = useSidebar()

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden md:flex md:flex-col md:fixed md:inset-y-0 transition-all duration-300 z-40",
        isCollapsed ? "md:w-16" : "md:w-64"
      )}>
        <div className="flex-1 flex flex-col min-h-0 bg-card border-r">
          <div className="flex items-center h-16 flex-shrink-0 px-4 border-b">
            <Link href="/admin" className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-lg overflow-hidden">
                  <Image src="/PHOTO-2025-10-02-00-42-10.jpg" alt="Admin Logo" width={32} height={32} className="h-8 w-8 object-cover" />
                </div>
              </div>
              {!isCollapsed && (
                <div className="ml-3">
                  <h1 className="text-lg font-semibold text-foreground">Admin Panel</h1>
                </div>
              )}
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto"
              onClick={toggleSidebar}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <item.icon
                      className={cn(
                        "flex-shrink-0 h-5 w-5",
                        isCollapsed ? "" : "mr-3",
                        isActive ? "text-primary-foreground" : "text-muted-foreground"
                      )}
                    />
                    {!isCollapsed && item.name}
                  </Link>
                )
              })}
            </nav>
            <div className="flex-shrink-0 flex border-t p-4">
              <Link
                href="/"
                className="flex-shrink-0 w-full group block"
                title={isCollapsed ? "Back to Store" : undefined}
              >
                <div className="flex items-center">
                  <LogOut className={cn(
                    "h-5 w-5 text-muted-foreground group-hover:text-foreground",
                    isCollapsed ? "" : "mr-3"
                  )} />
                  {!isCollapsed && (
                    <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground">
                      Back to Store
                    </p>
                  )}
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden fixed top-4 left-4 z-50"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex flex-col h-full">
            <div className="flex items-center h-16 flex-shrink-0 px-4 border-b">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-lg overflow-hidden">
                  <Image src="/PHOTO-2025-10-02-00-42-10.jpg" alt="Admin Logo" width={32} height={32} className="h-8 w-8 object-cover" />
                </div>
              </div>
              <div className="ml-3">
                <h1 className="text-lg font-semibold text-foreground">Admin Panel</h1>
              </div>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "mr-3 flex-shrink-0 h-5 w-5",
                        isActive ? "text-primary-foreground" : "text-muted-foreground"
                      )}
                    />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
            <div className="flex-shrink-0 flex border-t p-4">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex-shrink-0 w-full group block"
              >
                <div className="flex items-center">
                  <LogOut className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground">
                      Back to Store
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
