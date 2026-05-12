export function resolvePublicLocaleAndSlug(input: {
  segments?: string[]
  supportedLocales: string[]
  defaultLocale: string
}): {
  locale: string
  slug: string
} {
  const segments = (input.segments ?? [])
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0)

  const [first, ...rest] = segments
  const hasLocalePrefix = typeof first === "string" && input.supportedLocales.includes(first)

  const locale = hasLocalePrefix ? first : input.defaultLocale
  const slugSegments = hasLocalePrefix ? rest : segments
  const slug = slugSegments.length > 0 ? slugSegments.join("/") : "home"

  return { locale, slug }
}
