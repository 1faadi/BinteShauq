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
    const data = {
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

    const settings = existing
      ? await prisma.storeSettings.update({ where: { id: existing.id }, data })
      : await prisma.storeSettings.create({ data })

    return NextResponse.json(settings)
  } catch (e) {
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 })
  }
}


