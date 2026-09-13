import type { Metadata } from "next"
import { AdminLayoutShell } from "@/components/admin/admin-layout-shell"

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}): React.ReactElement {
  return <AdminLayoutShell>{children}</AdminLayoutShell>
}
