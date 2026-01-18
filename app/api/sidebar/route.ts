import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - Fetch all active sidebar sections with their items
export async function GET(request: NextRequest) {
  try {
    const sections = await prisma.sidebarSection.findMany({
      where: { isActive: true },
      include: {
        items: {
          where: { isActive: true },
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                images: true,
              }
            }
          },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(sections)
  } catch (error) {
    console.error("Error fetching sidebar:", error)
    return NextResponse.json(
      { error: "Failed to fetch sidebar" },
      { status: 500 }
    )
  }
}

