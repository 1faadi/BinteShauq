"use client"

import Link from "next/link"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarTrigger, SidebarRail, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { useSession, signOut } from "next-auth/react"
import { LogOut, User } from "lucide-react"
import type { SidebarSection as SidebarSectionType } from "@/lib/sidebar"

interface MainSidebarProps {
  sections: SidebarSectionType[]
}

export function MainSidebar({ sections }: MainSidebarProps) {
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
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between px-2 py-2">
          <h2 className="text-lg font-semibold">Collections</h2>
          <SidebarTrigger className="md:hidden" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-full">
          {sections.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No sections available
            </div>
          ) : (
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sections.map((section) => (
                    <SidebarMenuItem key={section.id}>
                      <SidebarMenuButton asChild className="w-full justify-start">
                        <Link href={`/sidebar/${getSectionSlug(section.title)}?id=${section.id}`}>
                          <span className="uppercase text-sm font-medium tracking-wide">{section.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className="border-t p-2">
        {session?.user ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-2 py-1.5 text-sm">
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

