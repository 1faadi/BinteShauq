import { createHash } from "node:crypto"
import { META_CURRENCY, META_PIXEL_ID, purchaseEventId } from "@/lib/meta-pixel"
import { SITE_URL } from "@/lib/site"

export type MetaCapiPurchaseInput = {
  orderId: string
  total: number
  items: { id: string; quantity: number; price: number }[]
  email?: string | null
  phone?: string | null
  clientIp?: string | null
  userAgent?: string | null
  fbp?: string | null
  fbc?: string | null
  eventSourceUrl?: string | null
}

type CapiResult =
  | { ok: true; skipped?: boolean; reason?: string }
  | { ok: false; error: string }

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex")
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

/** Pakistan-first phone normalize → digits with country code, no +. */
export function normalizePhoneForMeta(phone: string): string {
  const digits = phone.replace(/\D/g, "")
  if (!digits) return ""
  if (digits.startsWith("92")) return digits
  if (digits.startsWith("0")) return `92${digits.slice(1)}`
  if (digits.length === 10) return `92${digits}`
  return digits
}

function buildUserData(input: MetaCapiPurchaseInput): Record<string, unknown> {
  const userData: Record<string, unknown> = {}
  if (input.email) {
    userData.em = [sha256(normalizeEmail(input.email))]
  }
  if (input.phone) {
    const ph = normalizePhoneForMeta(input.phone)
    if (ph) userData.ph = [sha256(ph)]
  }
  if (input.clientIp) userData.client_ip_address = input.clientIp
  if (input.userAgent) userData.client_user_agent = input.userAgent
  if (input.fbp) userData.fbp = input.fbp
  if (input.fbc) userData.fbc = input.fbc
  userData.country = [sha256("pk")]
  return userData
}

/**
 * Sends Purchase to Meta Conversions API.
 * No-ops when META_CAPI_ACCESS_TOKEN is unset (browser pixel still tracks).
 */
export async function sendPurchaseCapi(
  input: MetaCapiPurchaseInput
): Promise<CapiResult> {
  const token = process.env.META_CAPI_ACCESS_TOKEN?.trim()
  if (!token) {
    return { ok: true, skipped: true, reason: "META_CAPI_ACCESS_TOKEN unset" }
  }

  const pixelId = process.env.META_PIXEL_ID?.trim() || META_PIXEL_ID
  const eventId = purchaseEventId(input.orderId)
  const testCode = process.env.META_CAPI_TEST_EVENT_CODE?.trim()

  const body: Record<string, unknown> = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        event_source_url:
          input.eventSourceUrl?.trim() || `${SITE_URL}/checkout`,
        action_source: "website",
        user_data: buildUserData(input),
        custom_data: {
          currency: META_CURRENCY,
          value: input.total,
          content_type: "product",
          content_ids: input.items.map((i) => i.id),
          contents: input.items.map((i) => ({
            id: i.id,
            quantity: i.quantity,
            item_price: i.price,
          })),
          num_items: input.items.reduce((s, i) => s + i.quantity, 0),
          order_id: input.orderId,
        },
      },
    ],
  }
  if (testCode) body.test_event_code = testCode

  try {
    const url = `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${encodeURIComponent(token)}`
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    const json: unknown = await res.json().catch(() => null)
    if (!res.ok) {
      const msg =
        typeof json === "object" &&
        json !== null &&
        "error" in json &&
        typeof (json as { error: { message?: unknown } }).error?.message ===
          "string"
          ? (json as { error: { message: string } }).error.message
          : `CAPI HTTP ${res.status}`
      console.error("meta-capi Purchase failed:", msg)
      return { ok: false, error: msg }
    }
    return { ok: true }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "CAPI request failed"
    console.error("meta-capi Purchase error:", msg)
    return { ok: false, error: msg }
  }
}

// ponytail: assert-based self-check
if (process.env.NODE_ENV === "test") {
  console.assert(normalizePhoneForMeta("03001234567") === "923001234567")
  console.assert(normalizePhoneForMeta("+92 300 1234567") === "923001234567")
  console.assert(purchaseEventId("x") === "x")
}
