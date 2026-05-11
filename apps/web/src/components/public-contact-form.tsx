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
    <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{headline}</h2>
        {intro && <p className="mt-2 text-gray-600">{intro}</p>}
      </div>

      {errors.length > 0 && (
        <div role="alert" className="mb-4 rounded-lg bg-red-50 p-4">
          <p className="text-sm font-medium text-red-800">Please fix the following errors:</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-red-700">
            {errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {showSuccess && (
        <div
          role="status"
          aria-live="polite"
          className="mb-4 rounded-lg bg-green-50 p-4"
        >
          <p className="text-sm font-medium text-green-800">{successMessage}</p>
          <p className="mt-1 text-xs text-green-700">
            Note: In demo mode, no email has been sent. Mail delivery is not yet configured.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Honeypot field (hidden) */}
        <div className="absolute -left-96 -top-96">
          <label htmlFor="website" className="sr-only">
            Website
          </label>
          <input
            id="website"
            name="website"
            type="text"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name <span className="text-red-500">*</span>
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
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email <span className="text-red-500">*</span>
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
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Your phone (optional)"
            disabled={isSubmitting}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your message..."
            rows={5}
            required
            disabled={isSubmitting}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
          />
        </div>

        <div className="flex items-start gap-3">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            checked={consentAccepted}
            onChange={(e) => setConsentAccepted(e.target.checked)}
            required
            disabled={isSubmitting}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
          />
          <label htmlFor="consent" className="text-sm text-gray-700">
            {consentLabel} <span className="text-red-500">*</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || showSuccess}
          className="w-full rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {isSubmitting ? "Sending..." : submitLabel}
        </button>
      </form>
    </div>
  )
}
