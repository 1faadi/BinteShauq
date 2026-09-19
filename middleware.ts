import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { isMaintenanceBypassPath } from "@/lib/maintenance"

async function isStoreInMaintenance(request: NextRequest): Promise<boolean> {
  try {
    const statusUrl = new URL("/api/store/maintenance", request.url)
    const res = await fetch(statusUrl, {
      cache: "no-store",
      headers: { "x-maintenance-probe": "1" },
    })
    if (!res.ok) return false
    const data: unknown = await res.json()
    if (data === null || typeof data !== "object") return false
    return (data as { maintenanceMode?: unknown }).maintenanceMode === true
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl

  if (isMaintenanceBypassPath(pathname)) {
    return NextResponse.next()
  }

  // Static public assets (images, fonts) under /public
  if (/\.(?:png|jpe?g|gif|webp|avif|svg|ico|woff2?|txt|xml|webmanifest)$/i.test(pathname)) {
    return NextResponse.next()
  }

  const maintenance = await isStoreInMaintenance(request)
  if (!maintenance) {
    return NextResponse.next()
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json(
      { error: "Store is under maintenance. Please try again later." },
      { status: 503, headers: { "Retry-After": "3600" } }
    )
  }

  const maintenanceUrl = request.nextUrl.clone()
  maintenanceUrl.pathname = "/maintenance"
  maintenanceUrl.search = ""
  return NextResponse.redirect(maintenanceUrl)
}

export const config = {
  matcher: [
    /*
     * Skip Next internals and common static files at the matcher level.
     * Remaining static extensions are still allowed inside middleware.
     */
    "/((?!_next/static|_next/image).*)",
  ],
}
