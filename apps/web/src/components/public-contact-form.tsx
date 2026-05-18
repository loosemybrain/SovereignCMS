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
    <div>
      <header className="mb-8">
        {headline ? <h2 className="pub-h2">{headline}</h2> : null}
        {intro ? <p className="pub-lead">{intro}</p> : null}
      </header>

      {errors.length > 0 ? (
        <div role="alert" className="pub-notice pub-notice--danger mb-6">
          <p className="font-semibold">Please fix the following:</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            {errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {showSuccess ? (
        <div role="status" aria-live="polite" className="pub-notice pub-notice--success mb-6">
          <p className="font-semibold">{successMessage}</p>
          <p className="mt-1 text-sm opacity-90">
            Note: In demo mode, no email has been sent. Mail delivery is not yet configured.
          </p>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="pub-form-stack" noValidate>
        <div className="absolute -left-[9999px] -top-[9999px]" aria-hidden="true">
          <input
            name="website"
            type="text"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div>
          <label htmlFor="cf-name" className="pub-form-label">
            Name <span className="text-red-600" aria-hidden="true">*</span>
            <span className="sr-only">(required)</span>
          </label>
          <input
            id="cf-name"
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
            autoComplete="name"
            disabled={isSubmitting}
            className="pub-field pub-focusable"
          />
        </div>

        <div>
          <label htmlFor="cf-email" className="pub-form-label">
            Email <span className="text-red-600" aria-hidden="true">*</span>
            <span className="sr-only">(required)</span>
          </label>
          <input
            id="cf-email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
            disabled={isSubmitting}
            className="pub-field pub-focusable"
          />
        </div>

        <div>
          <label htmlFor="cf-phone" className="pub-form-label">
            Phone
            <span className="ml-1 text-xs font-normal text-gray-500">(optional)</span>
          </label>
          <input
            id="cf-phone"
            name="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Your phone number"
            autoComplete="tel"
            disabled={isSubmitting}
            className="pub-field pub-focusable"
          />
        </div>

        <div>
          <label htmlFor="cf-message" className="pub-form-label">
            Message <span className="text-red-600" aria-hidden="true">*</span>
            <span className="sr-only">(required)</span>
          </label>
          <textarea
            id="cf-message"
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your message"
            rows={5}
            required
            disabled={isSubmitting}
            className="pub-field pub-focusable"
          />
        </div>

        <div className="pub-form-consent">
          <input
            id="cf-consent"
            name="consent"
            type="checkbox"
            checked={consentAccepted}
            onChange={(e) => setConsentAccepted(e.target.checked)}
            required
            disabled={isSubmitting}
            className="pub-focusable"
          />
          <label htmlFor="cf-consent">
            {consentLabel}{" "}
            <span className="text-red-600" aria-hidden="true">*</span>
            <span className="sr-only">(required)</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || showSuccess}
          className="pub-btn-primary pub-interactive pub-focusable w-full"
        >
          {isSubmitting ? "Sending…" : submitLabel}
        </button>
      </form>
    </div>
  )
}
