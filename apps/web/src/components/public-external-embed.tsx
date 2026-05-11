"use client"

import {
  type ExternalEmbedProps,
  validateExternalEmbedUrl,
} from "@sovereign-cms/core"
import { ExternalMediaGate } from "@/components/external-media-gate"

type Props = ExternalEmbedProps

export function PublicExternalEmbed({
  provider,
  title,
  embedUrl,
  consentText = "This external content requires your consent to be displayed.",
  buttonLabel = "Load Content",
}: Props) {
  // Validate URL
  const isValid = validateExternalEmbedUrl({
    provider,
    embedUrl,
  })

  if (!isValid) {
    return (
      <div className="rounded-lg border border-red-300 bg-red-50 p-6 text-center">
        <p className="text-sm font-medium text-red-800">
          Invalid embed URL for {provider} provider.
        </p>
        <p className="mt-1 text-xs text-red-700">
          Please check the URL configuration in the block settings.
        </p>
      </div>
    )
  }

  return (
    <ExternalMediaGate
      title={title}
      consentText={consentText}
      buttonLabel={buttonLabel}
    >
      <div className="aspect-video overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
        <iframe
          src={embedUrl}
          title={title}
          width="100%"
          height="100%"
          style={{
            border: "none",
            borderRadius: "0.5rem",
          }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </ExternalMediaGate>
  )
}
