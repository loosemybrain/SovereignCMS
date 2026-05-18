import { deMessages } from "./messages/de"
import { enMessages } from "./messages/en"
import type { AdminMessages, AdminUiLocale } from "./types"
import { DEFAULT_ADMIN_UI_LOCALE } from "./types"

export type { AdminMessages, AdminUiLocale }
export { ADMIN_UI_LOCALE_COOKIE, DEFAULT_ADMIN_UI_LOCALE } from "./types"

const catalogs: Record<AdminUiLocale, AdminMessages> = {
  en: enMessages,
  de: deMessages,
}

export function isAdminUiLocale(value: unknown): value is AdminUiLocale {
  return value === "de" || value === "en"
}

export function getAdminMessages(locale: AdminUiLocale): AdminMessages {
  return catalogs[locale]
}

/** Replace `{key}` placeholders in message templates. */
export function formatAdminMessage(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? `{${key}}`))
}
