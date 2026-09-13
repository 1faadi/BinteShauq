import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { contactSchema } from "@/lib/validators/forms"
import { rateLimit } from "@/lib/rate-limit"

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon"
    const limited = rateLimit(`contact:${ip}`, 5, 60_000)
    if (!limited.ok) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 }
      )
    }

    const body: unknown = await request.json()
    const parsed = contactSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.errors[0]?.message ?? "Invalid form data",
        },
        { status: 400 }
      )
    }

    if (parsed.data.website) {
      // Honeypot filled — pretend success
      return NextResponse.json({ success: true })
    }

    await prisma.contactMessage.create({
      data: {
        name: parsed.data.name.trim(),
        email: parsed.data.email?.trim() || null,
        phone: parsed.data.phone?.trim() || null,
        orderNumber: parsed.data.orderNumber?.trim() || null,
        subject: parsed.data.subject.trim(),
        message: parsed.data.message.trim(),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json(
      { success: false, error: "Unable to send your message right now." },
      { status: 500 }
    )
  }
}
