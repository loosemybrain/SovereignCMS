"use client"

import { useConsent } from "@/components/consent-provider"
import type { ReactNode } from "react"

type Props = {
  title: string
  consentText: string
  buttonLabel: string
  children: ReactNode
}

export function ExternalMediaGate({
  title,
  consentText,
  buttonLabel,
  children,
}: Props) {
  const { consentState, acceptExternalMedia } = useConsent()

  if (consentState.externalMedia) {
    return <>{children}</>
  }

  return (
    <div
      className="flex items-center justify-center overflow-hidden rounded-xl"
      style={{
        background: "var(--pub-surface-bg-subtle)",
        border: "1px solid var(--pub-surface-border)",
        minHeight: "280px",
      }}
    >
      <div className="max-w-sm px-6 py-10 text-center">
        {/* Shield icon */}
        <div
          className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
          style={{ background: "var(--pub-surface-bg-muted)" }}
          aria-hidden="true"
        >
          <svg
            className="h-6 w-6 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
            />
          </svg>
        </div>

        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">{consentText}</p>

        <button
          type="button"
          onClick={acceptExternalMedia}
          className="pub-btn-primary pub-interactive mt-6"
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  )
}
