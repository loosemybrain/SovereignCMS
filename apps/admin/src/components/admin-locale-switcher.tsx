"use client"

import type { LocaleContext } from "@sovereign-cms/core"
import { cn } from "@sovereign-cms/ui"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { useCallback } from "react"

export type AdminLocaleSwitcherProps = {
  activeLocale: string
  localeContext: LocaleContext
  /** e.g. "Content language" / "Inhaltssprache" */
  label?: string
}

/**
 * CMS content locale switcher (query param `locale`).
 * Builds hrefs on the client so Server Components do not pass functions.
 */
export function AdminLocaleSwitcher({
  activeLocale,
  localeContext,
  label = "Locale",
}: AdminLocaleSwitcherProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const hrefForLocale = useCallback(
    (localeCode: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("locale", localeCode)
      const qs = params.toString()
      return qs ? `${pathname}?${qs}` : pathname
    },
    [pathname, searchParams],
  )

  if (localeContext.supportedLocales.length <= 1) {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium admin-text-muted">{label}:</span>
      <div className="flex gap-1">
        {localeContext.supportedLocales.map((locale) => (
          <Link
            key={locale.code}
            href={hrefForLocale(locale.code)}
            className={cn(
              "rounded px-2 py-1 text-xs font-medium transition-all duration-200",
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
