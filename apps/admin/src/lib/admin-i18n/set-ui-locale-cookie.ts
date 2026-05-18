import { ADMIN_UI_LOCALE_COOKIE, type AdminUiLocale } from "./types"

/** Client-only: persist interface language for the next server render. */
export function setAdminUiLocaleCookie(locale: AdminUiLocale): void {
  document.cookie = `${ADMIN_UI_LOCALE_COOKIE}=${locale};path=/;max-age=31536000;SameSite=Lax`
}
