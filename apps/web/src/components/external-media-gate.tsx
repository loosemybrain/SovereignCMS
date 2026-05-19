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
    <div className="pub-consent-panel">
      <div className="max-w-sm">
        <h3 className="pub-h3">{title}</h3>
        <p className="pub-body mt-2">{consentText}</p>
        <button
          type="button"
          onClick={acceptExternalMedia}
          className="pub-btn-primary pub-interactive pub-focusable mt-6"
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  )
}
