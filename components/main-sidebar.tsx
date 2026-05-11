"use client"

import Link from "next/link"
import type React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarTrigger,
  SidebarRail,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { useSession, signOut } from "next-auth/react"
import { LogOut, User } from "lucide-react"
import type { SidebarSection as SidebarSectionType } from "@/lib/sidebar"
import { SHOP_NAV_GROUPS } from "@/lib/shop-nav"

interface MainSidebarProps {
  sections: SidebarSectionType[]
}

const sidebarNavLinkClass =
  "h-auto min-h-10 w-full justify-start items-start gap-2 overflow-visible py-2.5 text-sm font-normal leading-snug font-sans [&>span:last-child]:whitespace-normal [&>span:last-child]:overflow-visible [&>span:last-child]:break-words [&>span:last-child]:text-pretty"

const sidebarPrimaryLinkClass =
  "h-auto min-h-10 w-full justify-start py-2.5 caps text-xs font-medium tracking-[0.18em] font-sans"

export function MainSidebar({ sections }: MainSidebarProps): React.ReactElement {
  const { data: session } = useSession()

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
  }

  // Generate a slug from section title for the URL
  const getSectionSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  return (
    <Sidebar className="font-sans antialiased tracking-normal">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center justify-between gap-2 px-3 py-3">
          <h2 className="font-sans text-sm font-semibold caps tracking-wide text-sidebar-foreground">
            Browse
          </h2>
          <SidebarTrigger className="md:hidden shrink-0" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-full">
          <SidebarGroup>
            <SidebarGroupLabel className="font-sans caps-tight text-[11px] tracking-wide text-muted-foreground">
              Shop
            </SidebarGroupLabel>
            <SidebarGroupContent className="space-y-4">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className={sidebarPrimaryLinkClass}>
                    <Link href="/shop">
                      <span>All products</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
              {SHOP_NAV_GROUPS.map((group) => (
                <div key={group.heading} className="space-y-1 border-t border-sidebar-border pt-3">
                  <p className="font-sans caps-tight px-2 pb-1 text-[11px] font-medium tracking-wide text-muted-foreground">
                    {group.heading}
                  </p>
                  <SidebarMenu>
                    {group.links.map((link) => (
                      <SidebarMenuItem key={link.href}>
                        <SidebarMenuButton asChild className={sidebarNavLinkClass}>
                          <Link href={link.href}>
                            <span>{link.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </div>
              ))}
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="border-t border-sidebar-border pt-2">
            <SidebarGroupLabel className="font-sans caps-tight text-[11px] tracking-wide text-muted-foreground">
              Collections
            </SidebarGroupLabel>
            <SidebarGroupContent>
              {sections.length === 0 ? (
                <div className="px-2 py-3 text-center font-sans text-sm text-muted-foreground">
                  No sections available
                </div>
              ) : (
                <SidebarMenu>
                  {sections.map((section) => (
                    <SidebarMenuItem key={section.id}>
                      <SidebarMenuButton asChild className={sidebarNavLinkClass}>
                        <Link href={`/sidebar/${getSectionSlug(section.title)}?id=${section.id}`}>
                          <span>{section.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className="border-t p-2">
        {session?.user ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-2 py-1.5 font-sans text-sm">
              <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="font-medium truncate text-left">
                {session.user.name || session.user.email}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            asChild
          >
            <Link href="/auth/signin">
              <User className="h-4 w-4 mr-2" />
              Log in
            </Link>
          </Button>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

