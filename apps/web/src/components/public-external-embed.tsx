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
  const isValid = validateExternalEmbedUrl({ provider, embedUrl })

  if (!isValid) {
    return (
      <div className="pub-notice pub-notice--muted" role="alert">
        <p className="font-medium text-gray-700">This embed cannot be displayed.</p>
        <p className="mt-1 text-sm">Check the URL and provider settings for this block.</p>
      </div>
    )
  }

  return (
    <ExternalMediaGate title={title} consentText={consentText} buttonLabel={buttonLabel}>
      <div className="pub-embed-shell pub-embed-shell--ratio">
        <iframe
          src={embedUrl}
          title={title}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </ExternalMediaGate>
  )
}
