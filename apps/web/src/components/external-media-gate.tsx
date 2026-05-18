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
    <div className="pub-notice pub-notice--muted text-center">
      <h3 className="pub-heading-card">{title}</h3>
      <p className="pub-body pub-mt-2">{consentText}</p>

      <button
        type="button"
        onClick={acceptExternalMedia}
        className="pub-btn pub-btn--primary pub-interactive pub-mt-4"
      >
        {buttonLabel}
      </button>
    </div>
  )
}
