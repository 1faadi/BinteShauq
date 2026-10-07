import { z } from "zod"

export const MAX_HERO_SLIDES = 8

export const heroSlideSchema = z.object({
  imageUrl: z.string(),
  line1: z.string(),
  line2: z.string(),
  buttonText: z.string(),
  buttonHref: z.string(),
})

export const heroSlidesSchema = z.array(heroSlideSchema).max(MAX_HERO_SLIDES)

export type HeroSlide = z.infer<typeof heroSlideSchema>

function asTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : ""
}

/** Normalize raw JSON / legacy hero fields into validated slides. */
export function parseHeroSlides(
  raw: unknown,
  legacy?: {
    heroImageUrl?: string | null
    heroLine1?: string | null
    heroLine2?: string | null
    heroButtonText?: string | null
    heroButtonHref?: string | null
  },
): HeroSlide[] {
  const parsed = heroSlidesSchema.safeParse(raw)
  if (parsed.success && parsed.data.length > 0) {
    return parsed.data
  }

  return [
    {
      imageUrl: asTrimmedString(legacy?.heroImageUrl),
      line1: asTrimmedString(legacy?.heroLine1),
      line2: asTrimmedString(legacy?.heroLine2),
      buttonText: asTrimmedString(legacy?.heroButtonText),
      buttonHref: asTrimmedString(legacy?.heroButtonHref),
    },
  ]
}

export const newsletterSchema = z.object({
  email: z.string().email("Enter a valid email address"),
})

export const contactSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(120),
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().max(40).optional().or(z.literal("")),
    orderNumber: z.string().max(64).optional().or(z.literal("")),
    subject: z.string().min(1, "Subject is required").max(200),
    message: z.string().min(10, "Message must be at least 10 characters").max(5000),
    website: z.string().max(0).optional(), // honeypot
  })
  .refine((data) => Boolean(data.email?.trim() || data.phone?.trim()), {
    message: "Provide an email or phone number",
    path: ["email"],
  })

export type NewsletterInput = z.infer<typeof newsletterSchema>
export type ContactInput = z.infer<typeof contactSchema>
