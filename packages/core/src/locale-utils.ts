/**
 * Utility functions for locale handling.
 * Central logic for locale validation and defaults.
 */

import type { SupportedLocale } from "./locale"

/**
 * Check if a locale code is in the supported locales list.
 */
export function isSupportedLocale(
  locale: string,
  supportedLocales: SupportedLocale[],
): boolean {
  return supportedLocales.some((item) => item.code === locale)
}

/**
 * Get the default locale from supported locales.
 * Prefers explicit default, falls back to first, then "de".
 */
export function getDefaultLocale(supportedLocales: SupportedLocale[]): string {
  const explicitDefault = supportedLocales.find((item) => item.default)

  if (explicitDefault) {
    return explicitDefault.code
  }

  return supportedLocales[0]?.code ?? "de"
}

/**
 * Resolve locale: use provided, fall back to default if unsupported.
 */
export function resolveLocale(
  requestedLocale: string | undefined,
  supportedLocales: SupportedLocale[],
): string {
  if (!requestedLocale) {
    return getDefaultLocale(supportedLocales)
  }

  if (isSupportedLocale(requestedLocale, supportedLocales)) {
    return requestedLocale
  }

  return getDefaultLocale(supportedLocales)
}
