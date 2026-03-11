import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
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
      maintenanceMode: !!body.maintenanceMode,
      allowRegistration: !!body.allowRegistration,
      requireEmailVerification: !!body.requireEmailVerification,
      enableNotifications: !!body.enableNotifications,
      lowStockThreshold: Number(body.lowStockThreshold ?? 10),
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

    const settings = existing
      ? await prisma.storeSettings.update({ where: { id: existing.id }, data })
      : await prisma.storeSettings.create({ data })

    return NextResponse.json(settings)
  } catch (e) {
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 })
  }
}


