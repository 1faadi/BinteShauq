import type React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Logo } from "@/components/logo"
import { getMaintenanceMode } from "@/lib/maintenance"
import { BRAND_NAME } from "@/lib/site"
import { getStoreSettings } from "@/lib/settings"

export const metadata: Metadata = {
  title: `We'll be right back | ${BRAND_NAME}`,
  description: `${BRAND_NAME} is temporarily unavailable while we perform maintenance.`,
  robots: { index: false, follow: false },
}

export default async function MaintenancePage(): Promise<React.ReactElement> {
  if (!(await getMaintenanceMode())) {
    redirect("/")
  }

  const settings = await getStoreSettings()
  const storeName = settings?.storeName?.trim() || BRAND_NAME

  return (
    <div className="relative flex min-h-[80vh] flex-col items-center justify-center px-6 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_oklch(0.97_0.02_200),_transparent_55%),linear-gradient(to_bottom,_oklch(0.99_0.005_90),_oklch(0.97_0.01_200))]"
      />
      <div className="mx-auto flex w-full max-w-lg flex-col items-center text-center">
        <Logo size={56} />
        <p className="mt-8 font-[family-name:var(--font-playfair)] text-3xl tracking-tight text-foreground sm:text-4xl">
          {storeName}
        </p>
        <h1 className="mt-4 text-lg font-medium text-foreground sm:text-xl">
          We&apos;ll be right back
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
          Our store is temporarily closed for maintenance. Thank you for your
          patience — please check again soon.
        </p>
        <Link
          href="/auth/signin"
          className="mt-10 text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          Admin sign in
        </Link>
      </div>
    </div>
  )
}
