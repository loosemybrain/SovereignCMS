/**
 * Helper to resolve admin locale from request params and context.
 * Handles fallback chain: requested → supported → default.
 */

import type { LocaleContext } from "@sovereign-cms/core"
import { isSupportedLocale } from "@sovereign-cms/core"

export type ResolveAdminLocaleInput = {
  locale: string | undefined
  localeContext: LocaleContext
}

/**
 * Resolve the active locale for admin operations.
 * Validates against supported locales, falls back to default.
 *
 * @param input.locale - Requested locale (from query params)
 * @param input.localeContext - Runtime locale context
 * @returns - Valid locale code
 */
export function resolveAdminLocale(input: ResolveAdminLocaleInput): string {
  const requestedLocale = input.locale?.trim()

  // No locale requested → use default
  if (!requestedLocale) {
    return input.localeContext.defaultLocale
  }

  // Check if requested locale is supported
  if (isSupportedLocale(requestedLocale, input.localeContext.supportedLocales)) {
    return requestedLocale
  }

  // Unsupported locale → fall back to default
  return input.localeContext.defaultLocale
}
