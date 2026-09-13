export type CloudinaryTransformOptions = {
  width?: number
  height?: number
  crop?: "fill" | "fit" | "limit" | "scale"
  quality?: "auto" | number
}

const CLOUDINARY_HOST = "res.cloudinary.com"

function isCloudinaryUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.hostname === CLOUDINARY_HOST
  } catch {
    return false
  }
}

/**
 * Inserts delivery transforms into a Cloudinary upload URL.
 * Leaves local and non-Cloudinary URLs unchanged.
 */
export function cloudinaryUrl(
  src: string,
  options: CloudinaryTransformOptions = {}
): string {
  if (!src || src.startsWith("/") || src.startsWith("data:")) return src
  if (!isCloudinaryUrl(src)) return src

  const { width, height, crop = "fill", quality = "auto" } = options
  const transforms: string[] = ["f_auto", `q_${quality}`]
  if (width) transforms.push(`w_${Math.round(width)}`)
  if (height) transforms.push(`h_${Math.round(height)}`)
  if (width || height) transforms.push(`c_${crop}`)

  const marker = "/upload/"
  const idx = src.indexOf(marker)
  if (idx === -1) return src

  const before = src.slice(0, idx + marker.length)
  const after = src.slice(idx + marker.length)
  // Strip any existing transform segment (version or transforms before public id)
  const parts = after.split("/")
  const hasVersion = parts[0]?.startsWith("v") && /^v\d+$/.test(parts[0])
  const rest = hasVersion ? parts.slice(1).join("/") : after
  const versionPart = hasVersion ? `${parts[0]}/` : ""

  // If first segment looks like transforms (contains _), strip it
  const restParts = rest.split("/")
  const cleaned =
    restParts[0]?.includes("_") && !restParts[0].includes(".")
      ? restParts.slice(1).join("/")
      : rest

  return `${before}${transforms.join(",")}/${versionPart}${cleaned}`
}

export function productCardImageUrl(src: string): string {
  return cloudinaryUrl(src, { width: 600, height: 800, crop: "fill" })
}

export function productHeroImageUrl(src: string): string {
  return cloudinaryUrl(src, { width: 1200, height: 1600, crop: "fill" })
}

export function homepageHeroImageUrl(src: string): string {
  return cloudinaryUrl(src, { width: 1920, height: 1080, crop: "fill" })
}

// ponytail: self-check
if (process.env.NODE_ENV === "test") {
  const sample =
    "https://res.cloudinary.com/demo/image/upload/v123/folder/photo.jpg"
  const out = cloudinaryUrl(sample, { width: 400, height: 500 })
  console.assert(out.includes("f_auto"))
  console.assert(out.includes("w_400"))
  console.assert(out.includes("h_500"))
  console.assert(cloudinaryUrl("/local.jpg", { width: 100 }) === "/local.jpg")
}
