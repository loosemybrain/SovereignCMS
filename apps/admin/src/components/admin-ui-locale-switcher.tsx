"use client"

import { useRouter } from "next/navigation"
import { cn } from "@sovereign-cms/ui"
import type { AdminUiLocale } from "@/lib/admin-i18n"
import { setAdminUiLocaleCookie } from "@/lib/admin-i18n/set-ui-locale-cookie"
import { useAdminI18n } from "@/components/admin-i18n-provider"

const UI_LOCALES: AdminUiLocale[] = ["de", "en"]

type AdminUiLocaleSwitcherProps = {
  className?: string
}

/**
 * Switches admin **interface** language (cookie + refresh).
 * Distinct from AdminLocaleSwitcher (CMS content locale).
 */
export function AdminUiLocaleSwitcher({ className }: AdminUiLocaleSwitcherProps) {
  const router = useRouter()
  const { locale: activeLocale, messages } = useAdminI18n()

  const setLocale = (locale: AdminUiLocale) => {
    if (locale === activeLocale) return
    setAdminUiLocaleCookie(locale)
    router.refresh()
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-xs font-medium admin-text-muted">{messages.locale.uiLanguage}:</span>
      <div role="group" aria-label={messages.locale.uiLanguage} className="flex gap-1">
        {UI_LOCALES.map((locale) => (
          <button
            key={locale}
            type="button"
            onClick={() => setLocale(locale)}
            className={cn(
              "admin-focus-ring rounded px-2 py-1 text-xs font-medium transition-colors",
              activeLocale === locale
                ? "admin-accent-bg admin-text"
                : "admin-surface-muted admin-text-muted hover:admin-text",
            )}
            aria-pressed={activeLocale === locale}
          >
            {locale.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  )
}
