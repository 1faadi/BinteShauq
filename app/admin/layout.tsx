"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { SidebarProvider, useSidebar } from "@/lib/sidebar-context"

function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  const { isCollapsed } = useSidebar()

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <div className={`transition-all duration-300 ${isCollapsed ? 'md:ml-16' : 'md:ml-64'}`}>
        <AdminHeader />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/auth/signin")
  }

  return (
    <SidebarProvider>
      <AdminLayoutContent>
        {children}
      </AdminLayoutContent>
    </SidebarProvider>
  )
}
