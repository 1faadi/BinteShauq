import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getGuestIdFromCookies } from "@/lib/guest-cart"
import { mergeGuestCartIntoUser } from "@/lib/cart-owner"

export async function POST(): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Not signed in" }, { status: 401 })
    }
    const guestId = await getGuestIdFromCookies()
    if (guestId) {
      await mergeGuestCartIntoUser(session.user.id, guestId)
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Cart merge error:", error)
    return NextResponse.json({ success: false, error: "Merge failed" }, { status: 500 })
  }
}
