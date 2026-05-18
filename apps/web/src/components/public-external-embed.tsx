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
      <div
        className="flex items-center justify-center overflow-hidden rounded-xl px-6 py-10 text-center"
        style={{
          background: "var(--pub-surface-bg-subtle)",
          border: "1px solid var(--pub-surface-border)",
          minHeight: "160px",
        }}
        role="alert"
      >
        <div className="max-w-xs">
          <p className="text-sm font-medium text-gray-600">
            This embed cannot be displayed.
          </p>
          <p className="mt-1 text-xs text-gray-400">
            The content source is unavailable or the URL is not valid.
          </p>
        </div>
      </div>
    )
  }

  return (
    <ExternalMediaGate
      title={title}
      consentText={consentText}
      buttonLabel={buttonLabel}
    >
      <div
        className="overflow-hidden rounded-xl"
        style={{
          position: "relative",
          paddingBottom: "56.25%",  /* 16:9 */
          height: 0,
          border: "1px solid var(--pub-surface-border)",
        }}
      >
        <iframe
          src={embedUrl}
          title={title}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: "none",
          }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </ExternalMediaGate>
  )
}
