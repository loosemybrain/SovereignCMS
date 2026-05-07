/**
 * Locale types for multi-language content support.
 * Defines locale codes, supported locales, and locale context.
 */

/** ISO 639-1 locale code (e.g., "de", "en", "pl") */
export type LocaleCode = string

/** Configuration for a single supported locale */
export type SupportedLocale = {
  /** ISO 639-1 code */
  code: LocaleCode
  /** Human-readable label (e.g., "Deutsch", "English") */
  label: string
  /** Mark as default locale for content without explicit locale */
  default?: boolean
}

/** Runtime context for locale handling */
export type LocaleContext = {
  /** Current active locale */
  locale: LocaleCode
  /** All supported locales for this runtime */
  supportedLocales: SupportedLocale[]
  /** Default locale to use if none specified */
  defaultLocale: LocaleCode
}
