import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import {
  cartWhere,
  ensureGuestId,
  getGuestIdFromCookies,
  type CartOwner,
} from "@/lib/guest-cart"
import { prisma } from "@/lib/prisma"

export async function resolveCartOwner(createGuest = false): Promise<CartOwner | null> {
  const session = await getServerSession(authOptions)
  if (session?.user?.id) {
    return { type: "user", userId: session.user.id }
  }
  if (createGuest) {
    const guestId = await ensureGuestId()
    return { type: "guest", guestId }
  }
  const guestId = await getGuestIdFromCookies()
  if (guestId) return { type: "guest", guestId }
  return null
}

export async function mergeGuestCartIntoUser(
  userId: string,
  guestId: string
): Promise<void> {
  const guestItems = await prisma.cartItem.findMany({ where: { guestId } })
  for (const item of guestItems) {
    const existing = await prisma.cartItem.findFirst({
      where: {
        userId,
        productId: item.productId,
        size: item.size ?? "",
      },
    })
    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + item.quantity },
      })
      await prisma.cartItem.delete({ where: { id: item.id } })
    } else {
      await prisma.cartItem.update({
        where: { id: item.id },
        data: { userId, guestId: null },
      })
    }
  }
}

export { cartWhere }
