import { NextRequest, NextResponse } from "next/server"
import { revalidateTag } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { MAINTENANCE_CACHE_TAG } from "@/lib/maintenance"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const settings = await prisma.storeSettings.findFirst()
    return NextResponse.json(settings || null)
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const existing = await prisma.storeSettings.findFirst()
    const data: Record<string, unknown> = {
      storeName: body.storeName,
      storeDescription: body.storeDescription,
      storeEmail: body.storeEmail,
      storePhone: body.storePhone,
      storeAddress: body.storeAddress,
      storeWhatsapp: body.storeWhatsapp,
      storeInstagramUrl: body.storeInstagramUrl,
      announcementEnabled: !!body.announcementEnabled,
      announcementText: body.announcementText,
      announcementLink: body.announcementLink,
      codAdvancePkr: Math.max(0, Math.floor(Number(body.codAdvancePkr ?? 1000))),
      codHighOrderThresholdPkr: Math.max(
        0,
        Math.floor(Number(body.codHighOrderThresholdPkr ?? 30000))
      ),
      codHighOrderPercent: Math.min(
        100,
        Math.max(0, Math.floor(Number(body.codHighOrderPercent ?? 50)))
      ),
      exchangeWorkingDays: Math.max(1, Math.floor(Number(body.exchangeWorkingDays ?? 7))),
      deliveryEstimateText: body.deliveryEstimateText,
      maintenanceMode: !!body.maintenanceMode,
      allowRegistration: !!body.allowRegistration,
      requireEmailVerification: !!body.requireEmailVerification,
      enableNotifications: !!body.enableNotifications,
      lowStockThreshold: Number(body.lowStockThreshold ?? 10),
      deliveryChargeEnabled:
        body.deliveryChargeEnabled === undefined
          ? (existing?.deliveryChargeEnabled ?? true)
          : !!body.deliveryChargeEnabled,
      deliveryChargePkr: (() => {
        if (body.deliveryChargePkr === undefined || body.deliveryChargePkr === null) {
          return existing?.deliveryChargePkr ?? 300
        }
        const raw = Number(body.deliveryChargePkr)
        if (!Number.isFinite(raw)) return existing?.deliveryChargePkr ?? 300
        return Math.max(0, Math.floor(raw))
      })(),
      currency: body.currency,
      timezone: body.timezone,
    }
    if (body.heroLine1 !== undefined) data.heroLine1 = body.heroLine1
    if (body.heroLine2 !== undefined) data.heroLine2 = body.heroLine2
    if (body.heroFontFamily1 !== undefined) data.heroFontFamily1 = body.heroFontFamily1
    if (body.heroFontFamily2 !== undefined) data.heroFontFamily2 = body.heroFontFamily2
    if (body.heroFontSize1 !== undefined) data.heroFontSize1 = body.heroFontSize1
    if (body.heroFontSize2 !== undefined) data.heroFontSize2 = body.heroFontSize2
    if (body.heroFontWeight1 !== undefined) data.heroFontWeight1 = body.heroFontWeight1
    if (body.heroFontWeight2 !== undefined) data.heroFontWeight2 = body.heroFontWeight2
    if (body.heroImageUrl !== undefined) data.heroImageUrl = body.heroImageUrl
    if (body.heroButtonText !== undefined) data.heroButtonText = body.heroButtonText
    if (body.heroButtonHref !== undefined) data.heroButtonHref = body.heroButtonHref
    if (body.homeAboutTitle !== undefined) data.homeAboutTitle = body.homeAboutTitle
    if (body.homeAboutParagraph1 !== undefined) data.homeAboutParagraph1 = body.homeAboutParagraph1
    if (body.homeAboutParagraph2 !== undefined) data.homeAboutParagraph2 = body.homeAboutParagraph2
    if (body.homeAboutButtonText !== undefined) data.homeAboutButtonText = body.homeAboutButtonText
    if (body.homeAboutButtonHref !== undefined) data.homeAboutButtonHref = body.homeAboutButtonHref
    if (body.homeAboutImageUrl !== undefined) data.homeAboutImageUrl = body.homeAboutImageUrl
    if (body.homeAboutImageAlt !== undefined) data.homeAboutImageAlt = body.homeAboutImageAlt

    const settings = existing
      ? await prisma.storeSettings.update({
          where: { id: existing.id },
          data: data as Parameters<typeof prisma.storeSettings.update>[0]["data"],
        })
      : await prisma.storeSettings.create({
          data: {
            storeName: String(body.storeName ?? "Bint-e-Shauq"),
            ...data,
          } as Parameters<typeof prisma.storeSettings.create>[0]["data"],
        })

    revalidateTag(MAINTENANCE_CACHE_TAG)
    return NextResponse.json(settings)
  } catch (e) {
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body: unknown = await request.json()
    if (body === null || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 })
    }
    const payload = body as Record<string, unknown>

    const existing = await prisma.storeSettings.findFirst()
    if (!existing) {
      return NextResponse.json({ error: "Store settings not found" }, { status: 404 })
    }

    const data: {
      deliveryChargeEnabled?: boolean
      deliveryChargePkr?: number
    } = {}

    if (payload.deliveryChargeEnabled !== undefined) {
      data.deliveryChargeEnabled = !!payload.deliveryChargeEnabled
    }
    if (payload.deliveryChargePkr !== undefined) {
      const raw = Number(payload.deliveryChargePkr)
      if (!Number.isFinite(raw)) {
        return NextResponse.json({ error: "Invalid delivery charge" }, { status: 400 })
      }
      data.deliveryChargePkr = Math.max(0, Math.floor(raw))
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No delivery fields to update" }, { status: 400 })
    }

    const settings = await prisma.storeSettings.update({
      where: { id: existing.id },
      data,
    })

    return NextResponse.json(settings)
  } catch {
    return NextResponse.json({ error: "Failed to update delivery settings" }, { status: 500 })
  }
}


