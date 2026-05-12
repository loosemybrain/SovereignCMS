"use client"

import type { CmsBlock } from "@sovereign-cms/core"
import type { ContactFormBlockProps } from "@sovereign-cms/core"

type Props = {
  block: CmsBlock
}

export function ContactFormAdminRenderer({ block }: Props) {
  const props = (block.props ?? {}) as ContactFormBlockProps

  const headline = props.headline || "Contact us"
  const intro = props.intro || "Get in touch"
  const submitLabel = props.submitLabel || "Send message"
  const consentLabel = props.consentLabel || "I consent to processing my information"
  const recipientEmail = props.recipientEmail || "(will use tenant settings)"

  return (
    <div className="space-y-4 rounded-lg border border-gray-300 bg-white p-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{headline}</h3>
        {intro && <p className="mt-1 text-sm text-gray-600">{intro}</p>}
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-700">Name *</label>
          <input
            type="text"
            placeholder="Your name"
            disabled
            className="mt-1 w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700">Email *</label>
          <input
            type="email"
            placeholder="your@email.com"
            disabled
            className="mt-1 w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            placeholder="Your phone (optional)"
            disabled
            className="mt-1 w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700">Message *</label>
          <textarea
            placeholder="Your message"
            disabled
            rows={4}
            className="mt-1 w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500"
          />
        </div>

        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="consent"
            disabled
            className="mt-1 h-4 w-4 rounded border-gray-300 bg-gray-50 text-gray-500"
          />
          <label htmlFor="consent" className="text-xs text-gray-600">
            {consentLabel} *
          </label>
        </div>

        <button
          disabled
          className="w-full rounded bg-gray-400 px-4 py-2 text-sm font-medium text-white"
        >
          {submitLabel}
        </button>
      </div>

      <div className="border-t border-gray-200 pt-3">
        <p className="text-xs text-gray-500">
          <span className="font-medium">Recipient Email:</span> {recipientEmail}
        </p>
      </div>
    </div>
  )
}
