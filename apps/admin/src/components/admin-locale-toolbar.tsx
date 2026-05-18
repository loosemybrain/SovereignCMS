"use client"

import type { LocaleContext } from "@sovereign-cms/core"
import { AdminLocaleSwitcher } from "@/components/admin-locale-switcher"
import { AdminUiLocaleSwitcher } from "@/components/admin-ui-locale-switcher"
import { useAdminI18n } from "@/components/admin-i18n-provider"

type AdminLocaleToolbarProps = {
  activeLocale: string
  localeContext: LocaleContext
  className?: string
}

/** Content locale + UI locale switchers (clearly separated). */
export function AdminLocaleToolbar({
  activeLocale,
  localeContext,
  className,
}: AdminLocaleToolbarProps) {
  const { messages } = useAdminI18n()

  return (
    <div className={className ?? "flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between"}>
      <AdminLocaleSwitcher
        activeLocale={activeLocale}
        localeContext={localeContext}
        label={messages.locale.contentLanguage}
      />
      <AdminUiLocaleSwitcher />
    </div>
  )
}
