import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params
    const guestEmail = request.nextUrl.searchParams.get("email")?.trim().toLowerCase()

    if (!session?.user?.id && !guestEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const order = await prisma.order.findFirst({
      where: {
        id,
        OR: [
          ...(session?.user?.id ? [{ userId: session.user.id }] : []),
          ...(guestEmail ? [{ guestEmail }] : []),
        ],
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error("Order fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
