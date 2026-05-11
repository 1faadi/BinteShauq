import type { Prisma } from "@prisma/client"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getStoreSettings } from "@/lib/settings"
import {
  generatePackingSlipPdfBuffer,
  type PackingSlipBrandPayload,
  type PackingSlipOrderPayload,
  type PackingSlipProductLine,
} from "@/lib/packing-slip-pdf"

export const runtime = "nodejs"

type SlipOrder = Prisma.OrderGetPayload<{
  include: {
    user: {
      select: {
        name: true
        email: true
        phone: true
      }
    }
    items: {
      include: {
        product: {
          select: { name: true }
        }
      }
    }
  }
}>

function currencyLabelFromStore(code: string | undefined): string {
  const c = code ?? "PKR"
  return c === "PKR" ? "Rs." : `${c} `
}

function buildCustomerPhone(order: SlipOrder): string {
  const parts = [order.phone, order.user.phone].filter(
    (v): v is string => typeof v === "string" && v.trim() !== "",
  )
  return parts.length > 0 ? parts.join(" · ") : ""
}

function buildOrderPayload(order: SlipOrder, currencyLabel: string): PackingSlipOrderPayload {
  const lines: PackingSlipProductLine[] = order.items.map((item) => ({
    name: item.product.name,
    quantity: item.quantity,
    unitPrice: item.price,
    lineTotal: item.price * item.quantity,
  }))

  return {
    orderId: order.id,
    orderCreatedAt: order.createdAt,
    currencyLabel,
    customerName: order.user.name ?? "Customer",
    customerEmail: order.user.email,
    customerPhone: buildCustomerPhone(order),
    shippingAddress: order.shippingAddress,
    notes: order.notes,
    lines,
    orderTotal: order.total,
  }
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await context.params

    const [order, store] = await Promise.all([
      prisma.order.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              phone: true,
            },
          },
          items: {
            include: {
              product: {
                select: { name: true },
              },
            },
          },
        },
      }),
      getStoreSettings(),
    ])

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const brand: PackingSlipBrandPayload = {
      storeName: store?.storeName ?? "Bint-e-Shauq",
      storePhone: store?.storePhone ?? null,
      storeEmail: store?.storeEmail ?? null,
      storeAddress: store?.storeAddress ?? null,
    }

    const payload = buildOrderPayload(order, currencyLabelFromStore(store?.currency))

    const pdfBuffer = await generatePackingSlipPdfBuffer(payload, brand)
    const shortId = order.id.slice(-8).toUpperCase()
    const filename = `binteshauq-packing-slip-${shortId}.pdf`

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, no-store",
      },
    })
  } catch (error) {
    console.error("Packing slip PDF error:", error)
    return NextResponse.json({ error: "Failed to generate packing slip" }, { status: 500 })
  }
}
