import { cookies } from "next/headers"
import { randomUUID } from "crypto"

export const GUEST_CART_COOKIE = "bes_guest_cart_id"
const MAX_AGE = 60 * 60 * 24 * 30 // 30 days

export async function getGuestIdFromCookies(): Promise<string | null> {
  const jar = await cookies()
  return jar.get(GUEST_CART_COOKIE)?.value ?? null
}

export async function ensureGuestId(): Promise<string> {
  const jar = await cookies()
  const existing = jar.get(GUEST_CART_COOKIE)?.value
  if (existing) return existing
  const id = randomUUID()
  jar.set(GUEST_CART_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  })
  return id
}

export type CartOwner =
  | { type: "user"; userId: string }
  | { type: "guest"; guestId: string }

export function cartWhere(owner: CartOwner): { userId: string } | { guestId: string } {
  return owner.type === "user"
    ? { userId: owner.userId }
    : { guestId: owner.guestId }
}
