import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { newsletterSchema } from "@/lib/validators/forms"
import { rateLimit } from "@/lib/rate-limit"

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anon"
    const limited = rateLimit(`newsletter:${ip}`, 5, 60_000)
    if (!limited.ok) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 }
      )
    }

    const body: unknown = await request.json()
    const parsed = newsletterSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message ?? "Invalid email" },
        { status: 400 }
      )
    }

    const email = parsed.data.email.toLowerCase().trim()
    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({
        success: true,
        data: { alreadySubscribed: true },
        error: undefined,
      })
    }

    await prisma.newsletterSubscriber.create({ data: { email } })
    return NextResponse.json({ success: true, data: { alreadySubscribed: false } })
  } catch (error) {
    console.error("Newsletter subscribe error:", error)
    return NextResponse.json(
      { success: false, error: "Unable to subscribe right now." },
      { status: 500 }
    )
  }
}
