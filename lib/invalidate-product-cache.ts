import { cache } from "@/lib/cache"

/**
 * Clears in-memory caches so product PDP and listing data reflect admin writes.
 */
export function invalidateCachesAfterProductMutation(): void {
  cache.clear()
}
