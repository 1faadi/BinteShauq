"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { trackAnalytics } from "@/lib/analytics"

export function ContactForm(): React.ReactElement {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    orderNumber: "",
    subject: "",
    message: "",
    website: "",
  })

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const onSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setPending(true)
    setError("")
    setSuccess(false)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
            : "Could not send message"
        setError(err)
        return
      }
      setSuccess(true)
      trackAnalytics("contact_support", {})
      setForm({
        name: "",
        email: "",
        phone: "",
        orderNumber: "",
        subject: "",
        message: "",
        website: "",
      })
    } catch {
      setError("Could not send message. Please try again.")
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 text-left" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="contact-name">Name *</Label>
          <Input
            id="contact-name"
            name="name"
            required
            value={form.name}
            onChange={onChange}
            disabled={pending}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="contact-subject">Subject *</Label>
          <Input
            id="contact-subject"
            name="subject"
            required
            value={form.subject}
            onChange={onChange}
            disabled={pending}
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="contact-email">Email</Label>
          <Input
            id="contact-email"
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            disabled={pending}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="contact-phone">Phone</Label>
          <Input
            id="contact-phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={onChange}
            disabled={pending}
          />
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="contact-order">Order number (optional)</Label>
        <Input
          id="contact-order"
          name="orderNumber"
          value={form.orderNumber}
          onChange={onChange}
          disabled={pending}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="contact-message">Message *</Label>
        <Textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          value={form.message}
          onChange={onChange}
          disabled={pending}
        />
      </div>
      {/* honeypot */}
      <input
        type="text"
        name="website"
        value={form.website}
        onChange={onChange}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="text-sm text-muted-foreground" role="status">
          Thank you. We have received your message and will respond within 1–2 working days.
        </p>
      ) : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Sending…" : "Send message"}
      </Button>
    </form>
  )
}
