import assert from "node:assert/strict"
import { cloudinaryUrl, productCardImageUrl } from "../lib/cloudinary-url"
import {
  purchaseDedupeKey,
  claimPurchaseTracking,
  purchaseEventId,
} from "../lib/meta-pixel"
import { normalizePhoneForMeta } from "../lib/meta-capi"
import {
  formatCodAdvanceCopy,
  requiredCodAdvance,
  DEFAULT_COMMERCE_POLICY,
} from "../lib/commerce-policy"
import { absoluteUrl, BRAND_NAME } from "../lib/site"
import { isMaintenanceBypassPath } from "../lib/maintenance"
import {
  newsletterSchema,
  contactSchema,
  parseHeroSlides,
  heroSlidesSchema,
  MAX_HERO_SLIDES,
} from "../lib/validators/forms"
import { getOrderCustomer } from "../lib/order-customer"

const sample =
  "https://res.cloudinary.com/demo/image/upload/v123/folder/photo.jpg"
const transformed = cloudinaryUrl(sample, { width: 400, height: 500 })
assert.ok(transformed.includes("f_auto"))
assert.ok(transformed.includes("w_400"))
assert.equal(cloudinaryUrl("/local.jpg", { width: 100 }), "/local.jpg")
assert.ok(productCardImageUrl(sample).includes("w_600"))

assert.equal(purchaseDedupeKey("abc"), "meta_purchase_abc")
assert.equal(purchaseEventId("ord_9"), "ord_9")
assert.equal(normalizePhoneForMeta("03001234567"), "923001234567")
assert.equal(normalizePhoneForMeta("+92 300 1234567"), "923001234567")
const mem = new Map<string, string>()
const storage = {
  getItem: (k: string) => mem.get(k) ?? null,
  setItem: (k: string, v: string) => {
    mem.set(k, v)
  },
}
assert.equal(claimPurchaseTracking("o1", storage), true)
assert.equal(claimPurchaseTracking("o1", storage), false)

assert.ok(formatCodAdvanceCopy(DEFAULT_COMMERCE_POLICY).includes("1,000"))
assert.equal(requiredCodAdvance(10000, DEFAULT_COMMERCE_POLICY), 1000)
assert.equal(requiredCodAdvance(40000, DEFAULT_COMMERCE_POLICY), 20000)

assert.equal(absoluteUrl("/shop"), "https://www.binteshauq.store/shop")
assert.equal(BRAND_NAME, "Bint-e-Shauq")

assert.equal(isMaintenanceBypassPath("/admin"), true)
assert.equal(isMaintenanceBypassPath("/admin/settings"), true)
assert.equal(isMaintenanceBypassPath("/auth/signin"), true)
assert.equal(isMaintenanceBypassPath("/auth/signup"), false)
assert.equal(isMaintenanceBypassPath("/api/auth/session"), true)
assert.equal(isMaintenanceBypassPath("/api/admin/settings"), true)
assert.equal(isMaintenanceBypassPath("/maintenance"), true)
assert.equal(isMaintenanceBypassPath("/"), false)
assert.equal(isMaintenanceBypassPath("/shop"), false)
assert.equal(isMaintenanceBypassPath("/products/foo"), false)
assert.equal(isMaintenanceBypassPath("/api/products"), false)

assert.equal(newsletterSchema.safeParse({ email: "bad" }).success, false)
assert.equal(newsletterSchema.safeParse({ email: "a@b.com" }).success, true)
assert.equal(
  contactSchema.safeParse({
    name: "A",
    subject: "Hi",
    message: "Too short",
  }).success,
  false
)
assert.equal(
  contactSchema.safeParse({
    name: "Ayesha",
    email: "a@b.com",
    subject: "Order help",
    message: "I need help with sizing please.",
  }).success,
  true
)

const legacySlide = parseHeroSlides(null, {
  heroImageUrl: "/hero.jpg",
  heroLine1: "Headline",
  heroLine2: "Sub",
  heroButtonText: "Shop",
  heroButtonHref: "/shop",
})
assert.equal(legacySlide.length, 1)
assert.equal(legacySlide[0]?.imageUrl, "/hero.jpg")
assert.equal(legacySlide[0]?.line1, "Headline")

const multi = parseHeroSlides([
  {
    imageUrl: "/a.jpg",
    line1: "A",
    line2: "B",
    buttonText: "Go",
    buttonHref: "/a",
  },
  {
    imageUrl: "/b.jpg",
    line1: "C",
    line2: "D",
    buttonText: "Go",
    buttonHref: "/b",
  },
])
assert.equal(multi.length, 2)
assert.equal(multi[1]?.line1, "C")
assert.equal(heroSlidesSchema.safeParse(Array(MAX_HERO_SLIDES + 1).fill({
  imageUrl: "",
  line1: "",
  line2: "",
  buttonText: "",
  buttonHref: "",
})).success, false)

assert.equal(
  getOrderCustomer({
    guestEmail: "a@b.com",
    shippingAddress: "Ayesha Khan, Street 1, Karachi, Pakistan",
  }).name,
  "Ayesha Khan"
)
assert.equal(
  getOrderCustomer({ guestEmail: "a@b.com", shippingAddress: null }).name,
  "Guest"
)
assert.equal(
  getOrderCustomer({
    user: { name: "Sara", email: "s@b.com" },
    shippingAddress: "Ignored, Addr",
  }).isGuest,
  false
)

console.log("All storefront unit checks passed")
