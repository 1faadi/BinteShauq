import Link from "next/link"
import type { Metadata } from "next"
import { Card } from "@/components/ui/card"
import { ContactForm } from "@/components/contact-form"
import { getStoreSettings } from "@/lib/settings"
import { buildPageMetadata } from "@/lib/seo/metadata"
import { BRAND_NAME } from "@/lib/site"

export const dynamic = "force-dynamic"

const FALLBACK_PHONE = "+92 371 1538953"
const FALLBACK_EMAIL = "binteshauq@gmail.com"
const FALLBACK_WHATSAPP = "923711538953"

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: `Contact | ${BRAND_NAME}`,
    description:
      "Contact Bint-e-Shauq for order help, sizing questions, or general inquiries by email, phone, or WhatsApp.",
    path: "/contact",
  })
}

export default async function ContactPage(): Promise<React.ReactElement> {
  const settings = await getStoreSettings()
  const email = settings?.storeEmail?.trim() || FALLBACK_EMAIL
  const phone = settings?.storePhone?.trim() || FALLBACK_PHONE
  const phoneTel = phone.replace(/\s/g, "")
  const whatsappDigits = phoneTel.replace(/\D/g, "") || FALLBACK_WHATSAPP

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:py-20">
      <div className="text-center mb-10 md:mb-14">
        <p className="text-sm md:text-base text-muted-foreground mb-4 tracking-wide uppercase">
          Get in touch
        </p>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-light mb-6 tracking-tight">
          Contact Us
        </h1>
        <div className="h-px bg-border max-w-xs mx-auto" />
        <p className="mt-6 text-muted-foreground max-w-xl mx-auto">
          We would love to hear from you about orders, sizing, or general questions.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="p-6 md:p-8 border-none shadow-lg space-y-6">
          <div>
            <p className="caps-tight text-[11px] text-muted-foreground mb-1">Email</p>
            <a
              href={`mailto:${email}`}
              className="text-lg font-medium hover:text-primary transition-colors"
            >
              {email}
            </a>
          </div>
          <div>
            <p className="caps-tight text-[11px] text-muted-foreground mb-1">Phone</p>
            <a
              href={`tel:${phoneTel}`}
              className="text-lg font-medium hover:text-primary transition-colors"
            >
              {phone}
            </a>
          </div>
          <div>
            <p className="caps-tight text-[11px] text-muted-foreground mb-1">WhatsApp</p>
            <a
              href={`https://wa.me/${whatsappDigits}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-medium hover:text-primary transition-colors"
            >
              {phone}
            </a>
          </div>
          {settings?.storeAddress ? (
            <div>
              <p className="caps-tight text-[11px] text-muted-foreground mb-1">Address</p>
              <p className="whitespace-pre-line leading-relaxed">{settings.storeAddress}</p>
            </div>
          ) : null}
          <div className="pt-2 border-t">
            <Link
              href="/policies"
              className="text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline"
            >
              Policies & shipping
            </Link>
          </div>
        </Card>

        <Card className="p-6 md:p-8 border-none shadow-lg">
          <h2 className="text-xl font-medium mb-4">Send a message</h2>
          <ContactForm />
        </Card>
      </div>
    </div>
  )
}
