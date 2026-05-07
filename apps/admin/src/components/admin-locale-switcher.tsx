import type { LocaleContext } from "@sovereign-cms/core"
import { cn } from "@sovereign-cms/ui"
import Link from "next/link"

export type AdminLocaleSwitcherProps = {
  activeLocale: string
  localeContext: LocaleContext
  createHref: (locale: string) => string
}

/**
 * Admin locale switcher component.
 * Displays supported locales as simple buttons.
 * Server Component - safe to receive functions from parent.
 */
export function AdminLocaleSwitcher({
  activeLocale,
  localeContext,
  createHref,
}: AdminLocaleSwitcherProps) {
  if (localeContext.supportedLocales.length <= 1) {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-zinc-500 font-medium">Locale:</span>
      <div className="flex gap-1">
        {localeContext.supportedLocales.map((locale) => (
          <Link
            key={locale.code}
            href={createHref(locale.code)}
            className={cn(
              "px-2 py-1 rounded text-xs font-medium transition-all duration-200",
              activeLocale === locale.code
                ? "bg-blue-600 text-white"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700",
            )}
          >
            {locale.code.toUpperCase()}
          </Link>
        ))}
      </div>
    </div>
  )
}
