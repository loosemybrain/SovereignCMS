import { cookies } from "next/headers"
import {
  ADMIN_UI_LOCALE_COOKIE,
  DEFAULT_ADMIN_UI_LOCALE,
  getAdminMessages,
  isAdminUiLocale,
} from "./index"
import type { AdminMessages, AdminUiLocale } from "./types"

export async function getAdminUiLocale(): Promise<AdminUiLocale> {
  const cookieStore = await cookies()
  const value = cookieStore.get(ADMIN_UI_LOCALE_COOKIE)?.value
  return isAdminUiLocale(value) ? value : DEFAULT_ADMIN_UI_LOCALE
}

export async function getAdminMessagesForRequest(): Promise<{
  locale: AdminUiLocale
  messages: AdminMessages
}> {
  const locale = await getAdminUiLocale()
  return { locale, messages: getAdminMessages(locale) }
}
