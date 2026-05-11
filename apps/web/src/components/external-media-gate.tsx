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
    <div className="rounded-lg border border-gray-300 bg-gray-50 p-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mt-2 text-sm text-gray-700">{consentText}</p>

        <button
          type="button"
          onClick={acceptExternalMedia}
          className="mt-4 inline-block rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  )
}
