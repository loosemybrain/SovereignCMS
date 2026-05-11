export type ExternalEmbedProvider = "google-maps" | "generic"

export type ExternalEmbedProps = {
  provider: ExternalEmbedProvider
  title: string
  embedUrl: string
  consentText?: string
  buttonLabel?: string
}

export function validateGoogleMapsEmbedUrl(value: string): boolean {
  try {
    const url = new URL(value)

    const host = url.hostname.toLowerCase()
    const validHost =
      host === "google.com" || host === "www.google.com"

    return (
      url.protocol === "https:" &&
      validHost &&
      url.pathname.startsWith("/maps/embed")
    )
  } catch {
    return false
  }
}

export function validateExternalEmbedUrl(input: {
  provider: ExternalEmbedProvider
  embedUrl: string
}): boolean {
  if (input.provider === "google-maps") {
    return validateGoogleMapsEmbedUrl(input.embedUrl)
  }

  try {
    const url = new URL(input.embedUrl)
    return url.protocol === "https:"
  } catch {
    return false
  }
}
