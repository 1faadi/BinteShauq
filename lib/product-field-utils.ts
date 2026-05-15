import type { DupattaShawlKind } from "@/lib/product-details"

export function nullableTrimmedString(value: unknown): string | null {
  if (value === null || value === undefined) {
    return null
  }
  const trimmed = String(value).trim()
  return trimmed === "" ? null : trimmed
}

export function parseDupattaShawlKind(value: unknown): DupattaShawlKind | null {
  if (typeof value !== "string") {
    return null
  }
  const kind = value.toLowerCase()
  if (kind === "dupatta" || kind === "shawl") {
    return kind
  }
  return null
}
