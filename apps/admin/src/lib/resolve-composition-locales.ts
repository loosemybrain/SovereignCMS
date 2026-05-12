import type { SupportedLocale } from "@sovereign-cms/core"

export type ResolveCompositionLocalesInput = {
  compositionLocales: string[]
  compositionDefaultLocale: string
  runtimeSupportedLocales: SupportedLocale[]
  runtimeDefaultLocale: string
}

export type ResolvedCompositionLocales = {
  enabledLocales: string[]
  defaultLocale: string
  droppedLocales: string[]
}

export function resolveCompositionLocales(
  input: ResolveCompositionLocalesInput,
): ResolvedCompositionLocales {
  const runtimeCodes = input.runtimeSupportedLocales.map((item) => item.code)
  const runtimeSet = new Set(runtimeCodes)

  const uniqueCompositionLocales = Array.from(
    new Set(
      input.compositionLocales
        .map((locale) => locale.trim())
        .filter(Boolean),
    ),
  )

  const enabledLocales = uniqueCompositionLocales.filter((locale) => runtimeSet.has(locale))
  const droppedLocales = uniqueCompositionLocales.filter((locale) => !runtimeSet.has(locale))

  const fallbackLocales =
    enabledLocales.length > 0
      ? enabledLocales
      : runtimeCodes.length > 0
        ? runtimeCodes
        : [input.runtimeDefaultLocale || "de"]

  const defaultLocale = fallbackLocales.includes(input.compositionDefaultLocale)
    ? input.compositionDefaultLocale
    : fallbackLocales.includes(input.runtimeDefaultLocale)
      ? input.runtimeDefaultLocale
      : fallbackLocales[0] ?? "de"

  return {
    enabledLocales: fallbackLocales,
    defaultLocale,
    droppedLocales,
  }
}
