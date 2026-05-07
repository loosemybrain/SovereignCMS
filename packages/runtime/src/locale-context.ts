/**
 * Central locale context factory for runtime.
 * Creates consistent LocaleContext from config.
 */

import type { LocaleContext, SupportedLocale } from "@sovereign-cms/core"
import { resolveLocale } from "@sovereign-cms/core"

type CreateLocaleContextInput = {
  locale: string
  supportedLocales: SupportedLocale[]
  defaultLocale: string
}

/**
 * Create a LocaleContext from runtime config parts.
 * Validates and resolves locale if needed.
 */
export function createLocaleContext(input: CreateLocaleContextInput): LocaleContext {
  const resolvedLocale = resolveLocale(input.locale, input.supportedLocales)

  return {
    locale: resolvedLocale,
    supportedLocales: input.supportedLocales,
    defaultLocale: input.defaultLocale,
  }
}
