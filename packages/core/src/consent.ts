export type ConsentCategory = "necessary" | "external-media"

export type ConsentState = {
  necessary: true
  externalMedia: boolean
}

export function createDefaultConsentState(): ConsentState {
  return {
    necessary: true,
    externalMedia: false,
  }
}
