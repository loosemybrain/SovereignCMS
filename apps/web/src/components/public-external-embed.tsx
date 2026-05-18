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
  const isValid = validateExternalEmbedUrl({
    provider,
    embedUrl,
  })

  if (!isValid) {
    return (
      <section className="pub-notice pub-notice--danger" role="status">
        <p className="font-medium">Embed could not be loaded.</p>
        <p className="mt-1 text-sm opacity-90">
          Check the URL and provider settings for this block.
        </p>
      </section>
    )
  }

  return (
    <section className="pub-block pub-block-inner">
      <ExternalMediaGate title={title} consentText={consentText} buttonLabel={buttonLabel}>
        <div className="pub-embed-frame">
          <iframe
            src={embedUrl}
            title={title}
            width="100%"
            height="100%"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </ExternalMediaGate>
    </section>
  )
}
