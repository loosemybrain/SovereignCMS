import type { SeoMetadata } from "@sovereign-cms/core"

export type PublicSeoViewModel = {
  title: string
  description: string
  canonicalUrl: string
  robotsIndex: boolean
  imageUrl: string
}

export function mapSeoMetadataToPublicViewModel(
  seo: SeoMetadata | null | undefined
): PublicSeoViewModel {
  const data = seo || {}

  return {
    title: (data.seoTitle?.trim() ?? "").trim(),
    description: (data.seoDescription?.trim() ?? "").trim(),
    canonicalUrl: (data.canonicalUrl?.trim() ?? "").trim(),
    robotsIndex:
      typeof data.robotsIndex === "boolean"
        ? data.robotsIndex
        : true,
    imageUrl: (data.seoImageUrl?.trim() ?? "").trim(),
  }
}
