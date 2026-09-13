"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { trackAnalytics } from "@/lib/analytics"

export function NewsletterForm({
  className,
  compact = false,
}: {
  className?: string
  compact?: boolean
}): React.ReactElement {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const onSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setStatus("loading")
    setMessage("")
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data: unknown = await res.json()
      const ok =
        typeof data === "object" &&
        data !== null &&
        "success" in data &&
        (data as { success: boolean }).success
      if (!ok) {
        const err =
          typeof data === "object" &&
          data !== null &&
          "error" in data &&
          typeof (data as { error: unknown }).error === "string"
            ? (data as { error: string }).error
            : "Subscription failed"
        setStatus("error")
        setMessage(err)
        return
      }
      const already =
        typeof data === "object" &&
        data !== null &&
        "data" in data &&
        typeof (data as { data: unknown }).data === "object" &&
        (data as { data: { alreadySubscribed?: boolean } }).data?.alreadySubscribed
      setStatus("success")
      setMessage(
        already
          ? "You are already subscribed. Thank you!"
          : "You are subscribed. Welcome to Bint-e-Shauq."
      )
      trackAnalytics("newsletter_signup", {})
      setEmail("")
    } catch {
      setStatus("error")
      setMessage("Something went wrong. Please try again.")
    }
  }

  return (
    <form onSubmit={onSubmit} className={className} noValidate>
      {!compact ? (
        <p className="text-sm text-muted-foreground mb-3">
          New arrivals, seasonal edits, and care tips — no spam. Unsubscribe anytime.
        </p>
      ) : null}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 space-y-1">
          <Label htmlFor="newsletter-email" className={compact ? "sr-only" : undefined}>
            Email address
          </Label>
          <Input
            id="newsletter-email"
            type="email"
            name="email"
            autoComplete="email"
            required
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading"}
            aria-invalid={status === "error"}
            aria-describedby="newsletter-status"
          />
        </div>
        <Button type="submit" disabled={status === "loading"} className="sm:self-end">
          {status === "loading" ? "Subscribing…" : "Subscribe"}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        By subscribing you agree to our privacy practices. We store your email to send updates.
      </p>
      <div
        id="newsletter-status"
        role="status"
        aria-live="polite"
        className={`mt-2 text-sm ${status === "error" ? "text-destructive" : "text-muted-foreground"}`}
      >
        {message}
      </div>
    </form>
  )
}
