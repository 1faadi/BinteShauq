import { z } from "zod"

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
