"use client"

import { useState } from "react"
import { submitContactFormAction } from "@/actions/submit-contact-form"

type Props = {
  tenantId: string
  locale: string
  pageId?: string
  blockId?: string
  recipientEmail?: string
  headline?: string
  intro?: string
  submitLabel?: string
  successMessage?: string
  consentLabel?: string
}

export function PublicContactForm({
  tenantId,
  locale,
  pageId,
  blockId,
  recipientEmail,
  headline = "Get in Touch",
  intro = "Send us a message.",
  submitLabel = "Send Message",
  successMessage = "Thank you for your message. We'll get back to you soon.",
  consentLabel = "I consent to processing my information.",
}: Props) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [consentAccepted, setConsentAccepted] = useState(false)
  const [honeypot, setHoneypot] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors([])
    setIsSubmitting(true)

    try {
      const result = await submitContactFormAction({
        tenantId,
        locale,
        pageId,
        blockId,
        recipientEmail,
        name,
        email,
        phone,
        message,
        consentAccepted,
        honeypot,
      })

      if (result.success) {
        setShowSuccess(true)
        setName("")
        setEmail("")
        setPhone("")
        setMessage("")
        setConsentAccepted(false)

        setTimeout(() => {
          setShowSuccess(false)
        }, 5000)
      } else {
        setErrors(result.message.split(", "))
      }
    } catch {
      setErrors(["An unexpected error occurred. Please try again."])
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="pub-form-surface">
      <div className="mb-6">
        <h2 className="pub-heading-section">{headline}</h2>
        {intro ? <p className="pub-body">{intro}</p> : null}
      </div>

      {errors.length > 0 && (
        <div role="alert" className="pub-notice pub-notice--danger pub-notice--spaced">
          <p className="font-medium">Please fix the following:</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            {errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {showSuccess && (
        <div role="status" aria-live="polite" className="pub-notice pub-notice--success pub-notice--spaced">
          <p className="font-medium">{successMessage}</p>
          <p className="mt-1 text-xs opacity-90">
            Note: In demo mode, no email has been sent. Mail delivery is not yet configured.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="pub-form-stack">
        <div className="pub-sr-only" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            name="website"
            type="text"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="pub-form-field">
          <label htmlFor="name" className="pub-form-label">
            Name <span aria-hidden="true">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
            disabled={isSubmitting}
            className="pub-form-input"
          />
        </div>

        <div className="pub-form-field">
          <label htmlFor="email" className="pub-form-label">
            Email <span aria-hidden="true">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            disabled={isSubmitting}
            className="pub-form-input"
          />
        </div>

        <div className="pub-form-field">
          <label htmlFor="phone" className="pub-form-label">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Optional"
            disabled={isSubmitting}
            className="pub-form-input"
          />
        </div>

        <div className="pub-form-field">
          <label htmlFor="message" className="pub-form-label">
            Message <span aria-hidden="true">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your message"
            rows={5}
            required
            disabled={isSubmitting}
            className="pub-form-input pub-form-textarea"
          />
        </div>

        <div className="pub-form-consent">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            checked={consentAccepted}
            onChange={(e) => setConsentAccepted(e.target.checked)}
            required
            disabled={isSubmitting}
          />
          <label htmlFor="consent" className="pub-form-label font-normal">
            {consentLabel} <span aria-hidden="true">*</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || showSuccess}
          className="pub-btn pub-btn--primary pub-interactive w-full"
        >
          {isSubmitting ? "Sending…" : submitLabel}
        </button>
      </form>
    </section>
  )
}
