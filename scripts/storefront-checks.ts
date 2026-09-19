import assert from "node:assert/strict"
import { cloudinaryUrl, productCardImageUrl } from "../lib/cloudinary-url"
import { purchaseDedupeKey, claimPurchaseTracking } from "../lib/meta-pixel"
import {
  formatCodAdvanceCopy,
  requiredCodAdvance,
  DEFAULT_COMMERCE_POLICY,
} from "../lib/commerce-policy"
import { absoluteUrl, BRAND_NAME } from "../lib/site"
import { isMaintenanceBypassPath } from "../lib/maintenance"
import { newsletterSchema, contactSchema } from "../lib/validators/forms"

const sample =
  "https://res.cloudinary.com/demo/image/upload/v123/folder/photo.jpg"
const transformed = cloudinaryUrl(sample, { width: 400, height: 500 })
assert.ok(transformed.includes("f_auto"))
assert.ok(transformed.includes("w_400"))
assert.equal(cloudinaryUrl("/local.jpg", { width: 100 }), "/local.jpg")
assert.ok(productCardImageUrl(sample).includes("w_600"))

assert.equal(purchaseDedupeKey("abc"), "meta_purchase_abc")
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

console.log("All storefront unit checks passed")
