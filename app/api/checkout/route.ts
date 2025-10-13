import Stripe from "stripe"
import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { items, paymentMethod } = await req.json()

    // If payment method is COD, no need for Stripe
    if (paymentMethod === "cod") {
      return NextResponse.json({ 
        success: true,
        message: "COD order will be processed" 
      })
    }

    // Handle Stripe payment
    const stripeSecret = process.env.STRIPE_SECRET_KEY
    if (!stripeSecret) {
      return NextResponse.json({ error: "Stripe is not configured" }, { status: 500 })
    }
    
    const stripe = new Stripe(stripeSecret, { apiVersion: "2025-09-30.clover" })

    const line_items =
      Array.isArray(items) && items.length
        ? items.map((it: any) => ({
            price_data: {
              currency: "pkr",
              product_data: { name: it.name },
              unit_amount: it.unitAmount,
            },
            quantity: it.quantity ?? 1,
          }))
        : []

    const stripeSession = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${req.nextUrl.origin}/shop?status=success`,
      cancel_url: `${req.nextUrl.origin}/shop?status=cancelled`,
    })

    return NextResponse.json({ id: stripeSession.id, url: stripeSession.url })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json({ error: "Failed to process checkout" }, { status: 500 })
  }
}
