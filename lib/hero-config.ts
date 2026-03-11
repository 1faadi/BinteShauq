/** Font family options for hero text - maps to CSS variables from layout */
export const HERO_FONT_FAMILIES = [
  { value: "geist", label: "Geist Sans (Default)", fontFamily: "var(--font-geist-sans), system-ui, sans-serif" },
  { value: "playfair", label: "Playfair Display", fontFamily: "var(--font-playfair), Georgia, serif" },
  { value: "lora", label: "Lora", fontFamily: "var(--font-lora), Georgia, serif" },
  { value: "inter", label: "Inter", fontFamily: "var(--font-inter), system-ui, sans-serif" },
  { value: "montserrat", label: "Montserrat", fontFamily: "var(--font-montserrat), system-ui, sans-serif" },
  { value: "georgia", label: "Georgia", fontFamily: "Georgia, serif" },
  { value: "system", label: "System UI", fontFamily: "system-ui, sans-serif" },
] as const

/** Font size options - line 1 (main headline) */
export const HERO_FONT_SIZES_LINE1 = [
  { value: "4xl", label: "4xl", className: "text-4xl" },
  { value: "5xl", label: "5xl", className: "text-5xl" },
  { value: "6xl", label: "6xl", className: "text-6xl" },
  { value: "7xl", label: "7xl", className: "text-7xl" },
  { value: "8xl", label: "8xl", className: "text-8xl" },
] as const

/** Font size options - line 2 (subheadline) */
export const HERO_FONT_SIZES_LINE2 = [
  { value: "xl", label: "xl", className: "text-xl" },
  { value: "2xl", label: "2xl", className: "text-2xl" },
  { value: "3xl", label: "3xl", className: "text-3xl" },
  { value: "4xl", label: "4xl", className: "text-4xl" },
  { value: "5xl", label: "5xl", className: "text-5xl" },
] as const

/** Font weight options */
export const HERO_FONT_WEIGHTS = [
  { value: "normal", label: "Normal", className: "font-normal" },
  { value: "medium", label: "Medium", className: "font-medium" },
  { value: "semibold", label: "Semibold", className: "font-semibold" },
  { value: "bold", label: "Bold", className: "font-bold" },
] as const

export function getFontFamily(value: string | null | undefined): string {
  return HERO_FONT_FAMILIES.find((f) => f.value === value)?.fontFamily ?? "var(--font-geist-sans), system-ui, sans-serif"
}

export function getFontSizeClass1(value: string | null | undefined): string {
  return HERO_FONT_SIZES_LINE1.find((s) => s.value === value)?.className ?? "text-6xl"
}

export function getFontSizeClass2(value: string | null | undefined): string {
  return HERO_FONT_SIZES_LINE2.find((s) => s.value === value)?.className ?? "text-3xl"
}

export function getFontWeightClass(value: string | null | undefined): string {
  return HERO_FONT_WEIGHTS.find((w) => w.value === value)?.className ?? "font-bold"
}
