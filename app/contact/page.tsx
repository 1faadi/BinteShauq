import Link from "next/link"
import type React from "react"
import { Card } from "@/components/ui/card"
import { getStoreSettings } from "@/lib/settings"

export default async function ContactPage(): Promise<React.ReactElement> {
  const settings = await getStoreSettings()

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
      </div>

      <Card className="p-8 md:p-12 border-none shadow-lg">
        <div className="space-y-8 text-center md:text-left">
          <p className="text-muted-foreground leading-relaxed">
            We would love to hear from you about orders, sizing, or general questions.
          </p>

          <div className="space-y-4">
            {settings?.storeEmail ? (
              <div>
                <p className="caps-tight text-[11px] text-muted-foreground mb-1">Email</p>
                <a
                  href={`mailto:${settings.storeEmail}`}
                  className="text-lg font-medium hover:text-primary transition-colors"
                >
                  {settings.storeEmail}
                </a>
              </div>
            ) : null}

            {settings?.storePhone ? (
              <div>
                <p className="caps-tight text-[11px] text-muted-foreground mb-1">Phone</p>
                <a
                  href={`tel:${settings.storePhone.replace(/\s/g, "")}`}
                  className="text-lg font-medium hover:text-primary transition-colors"
                >
                  {settings.storePhone}
                </a>
              </div>
            ) : null}

            {!settings?.storeEmail && !settings?.storePhone ? (
              <p className="text-sm text-muted-foreground">
                Store email and phone can be configured in your admin settings.
              </p>
            ) : null}

            {settings?.storeAddress ? (
              <div>
                <p className="caps-tight text-[11px] text-muted-foreground mb-1">Address</p>
                <p className="whitespace-pre-line leading-relaxed">{settings.storeAddress}</p>
              </div>
            ) : null}
          </div>

          <div className="pt-4 border-t">
            <Link href="/policies" className="text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline">
              Policies & shipping
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
}
