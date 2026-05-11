"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { createDefaultConsentState, type ConsentState } from "@sovereign-cms/core"

type ConsentContextValue = {
  consentState: ConsentState
  acceptExternalMedia: () => void
}

const ConsentContext = createContext<ConsentContextValue | undefined>(undefined)

type Props = {
  children: ReactNode
}

export function ConsentProvider({ children }: Props) {
  const [consentState, setConsentState] = useState<ConsentState>(
    createDefaultConsentState()
  )

  const acceptExternalMedia = () => {
    setConsentState((prev) => ({
      ...prev,
      externalMedia: true,
    }))
  }

  return (
    <ConsentContext.Provider value={{ consentState, acceptExternalMedia }}>
      {children}
    </ConsentContext.Provider>
  )
}

export function useConsent(): ConsentContextValue {
  const context = useContext(ConsentContext)
  if (!context) {
    throw new Error("useConsent must be used within a ConsentProvider")
  }
  return context
}
