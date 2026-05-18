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
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          {headline}
        </h2>
        {intro ? (
          <p className="mt-3 text-lg leading-relaxed text-gray-600">{intro}</p>
        ) : null}
      </div>

      {errors.length > 0 ? (
        <div
          role="alert"
          className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4"
        >
          <p className="text-sm font-semibold text-red-800">
            Please fix the following:
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-red-700">
            {errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {showSuccess ? (
        <div
          role="status"
          aria-live="polite"
          className="mb-6 rounded-lg border border-green-200 bg-green-50 p-5"
        >
          <p className="font-semibold text-green-800">{successMessage}</p>
          <p className="mt-1 text-sm text-green-700">
            Note: In demo mode, no email has been sent. Mail delivery is not yet configured.
          </p>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Honeypot (hidden from users and assistive tech) */}
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
          <label
            htmlFor="cf-name"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Name <span className="text-red-500" aria-hidden="true">*</span>
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
            className="pub-field"
          />
        </div>

        <div>
          <label
            htmlFor="cf-email"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Email <span className="text-red-500" aria-hidden="true">*</span>
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
            className="pub-field"
          />
        </div>

        <div>
          <label
            htmlFor="cf-phone"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Phone
            <span className="ml-1 text-xs font-normal text-gray-400">(optional)</span>
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
            className="pub-field"
          />
        </div>

        <div>
          <label
            htmlFor="cf-message"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Message <span className="text-red-500" aria-hidden="true">*</span>
            <span className="sr-only">(required)</span>
          </label>
          <textarea
            id="cf-message"
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your message…"
            rows={5}
            required
            disabled={isSubmitting}
            className="pub-field"
          />
        </div>

        <div className="flex items-start gap-3">
          <input
            id="cf-consent"
            name="consent"
            type="checkbox"
            checked={consentAccepted}
            onChange={(e) => setConsentAccepted(e.target.checked)}
            required
            disabled={isSubmitting}
            className="mt-0.5 h-5 w-5 flex-shrink-0 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:cursor-not-allowed"
          />
          <label htmlFor="cf-consent" className="text-sm leading-relaxed text-gray-700">
            {consentLabel}{" "}
            <span className="text-red-500" aria-hidden="true">*</span>
            <span className="sr-only">(required)</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || showSuccess}
          className="pub-btn-primary pub-interactive w-full"
        >
          {isSubmitting ? "Sending…" : submitLabel}
        </button>
      </form>
    </div>
  )
}
