"use client"

import { createContext, useContext, useMemo } from "react"
import type { AdminMessages, AdminUiLocale } from "@/lib/admin-i18n"
import { getAdminMessages } from "@/lib/admin-i18n"

type AdminI18nContextValue = {
  locale: AdminUiLocale
  messages: AdminMessages
}

const AdminI18nContext = createContext<AdminI18nContextValue | null>(null)

export function AdminI18nProvider({
  locale,
  children,
}: {
  locale: AdminUiLocale
  children: React.ReactNode
}) {
  const value = useMemo(
    () => ({
      locale,
      messages: getAdminMessages(locale),
    }),
    [locale],
  )

  return <AdminI18nContext.Provider value={value}>{children}</AdminI18nContext.Provider>
}

export function useAdminI18n(): AdminI18nContextValue {
  const context = useContext(AdminI18nContext)
  if (!context) {
    throw new Error("useAdminI18n must be used inside AdminI18nProvider")
  }
  return context
}
